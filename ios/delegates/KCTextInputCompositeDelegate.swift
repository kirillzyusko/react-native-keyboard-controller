//
//  KCTextInputCompositeDelegate.swift
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 24/04/2024.
//

import Foundation

/// `caretRect(for:)` is in `textInputView`'s coordinates. For a `UITextField` that is its inner text area, which
/// starts below the field's top padding, so the caret came out higher than it is. Android measures y from the
/// field's top, and so does `KeyboardAwareScrollView` when it adds the caret to the input's layout.
func caretYOffset(in textInput: UITextInput) -> CGFloat {
  guard let textField = textInput as? UITextField else { return 0 }

  return textField.textInputView.convert(CGPoint.zero, to: textField).y
}

func textSelection(in textInput: UITextInput) -> NSDictionary? {
  if let selectedRange = textInput.selectedTextRange {
    let caretRectStart = textInput.caretRect(for: selectedRange.start)
    let caretRectEnd = textInput.caretRect(for: selectedRange.end)
    // `caretRect` is `CGRectNull` (infinite origin) for a position that is not laid out yet
    guard caretRectStart.isFinite, caretRectEnd.isFinite else { return nil }
    let yOffset = caretYOffset(in: textInput)

    return [
      "selection": [
        "start": [
          "x": caretRectStart.origin.x,
          "y": caretRectStart.origin.y + yOffset,
          "position": textInput.offset(from: textInput.beginningOfDocument, to: selectedRange.start),
        ],
        "end": [
          "x": caretRectEnd.origin.x + caretRectEnd.size.width,
          "y": caretRectEnd.origin.y + caretRectEnd.size.height + yOffset,
          "position": textInput.offset(from: textInput.beginningOfDocument, to: selectedRange.end),
        ],
      ],
    ]
  }

  return nil
}

func updateSelectionPosition(textInput: UITextInput, sendEvent: (_ event: NSDictionary) -> Void) {
  if let selection = textSelection(in: textInput) {
    sendEvent(selection)
  }
}

/**
 * A delegate that is being set to any focused input
 * and intercepts some specific events that needs to be handled
 * for universal keyboard avoiding solutions (such as text selection etc.)
 * and forward all calls to underlying delegate
 */
class KCTextInputCompositeDelegate: NSObject, UITextViewDelegate, UITextFieldDelegate {
  // constructor members
  var onSelectionChange: (_ event: NSDictionary) -> Void
  var onTextChange: (_ text: String?) -> Void
  // delegates
  weak var textViewDelegate: UITextViewDelegate?
  weak var textFieldDelegate: UITextFieldDelegate?

  /// Keep track of which textField we’re observing (iOS < 13 only)
  private weak var observedTextFieldForSelection: UITextField?

  /// `true` between `textView(_:shouldChangeTextIn:replacementText:)` and `textViewDidChange(_:)`
  private var isApplyingTextChange = false
  /// a selection callback arrived while the text was changing and still has to be reported
  private var hasSkippedSelectionUpdate = false
  private var pendingSelectionUpdate: DispatchWorkItem?

  init(
    onSelectionChange: @escaping (_ event: NSDictionary) -> Void,
    onTextChange: @escaping (_ text: String?) -> Void
  ) {
    self.onSelectionChange = onSelectionChange
    self.onTextChange = onTextChange
  }

  // MARK: setters/getters

  func setTextViewDelegate(delegate: UITextViewDelegate?) {
    resetSelectionTracking()
    // remove KVO from any old textField
    if let oldTextField = observedTextFieldForSelection {
      removeSelectionRangeObserver(from: oldTextField)
    }

    textViewDelegate = delegate
    textFieldDelegate = nil
    observedTextFieldForSelection = nil
  }

  func setTextFieldDelegate(delegate: UITextFieldDelegate?, textField: UITextField?) {
    resetSelectionTracking()
    // remove KVO from any old textField
    if let oldTextField = observedTextFieldForSelection {
      removeSelectionRangeObserver(from: oldTextField)
    }

    textFieldDelegate = delegate
    textViewDelegate = nil

    // If iOS < 13, add KVO to the actual textField object
    if #available(iOS 13.0, *) {
      // rely on textFieldDidChangeSelection
      observedTextFieldForSelection = nil
    } else if let realTextField = textField {
      addSelectionRangeObserver(to: realTextField)
      observedTextFieldForSelection = realTextField
    }
  }

  /// Getter for the active delegate
  var activeDelegate: AnyObject? {
    return textViewDelegate ?? textFieldDelegate
  }

  // MARK: UITextViewDelegate

  func textView(
    _ textView: UITextView,
    shouldChangeTextIn range: NSRange,
    replacementText text: String
  ) -> Bool {
    // UIKit reports the new selection before it finishes applying the edit, so the caret geometry read from
    // `textViewDidChangeSelection` can still describe the old layout. Mark the edit and read the geometry in
    // `textViewDidChange`, which UIKit sends after `UITextView` has updated its layout.
    isApplyingTextChange = true
    let shouldChange = textViewDelegate?.textView?(textView, shouldChangeTextIn: range, replacementText: text) ?? true
    if !shouldChange {
      // the edit was rejected or applied by the delegate itself (e.g. RN `maxLength`) - UIKit will not
      // send `textViewDidChange`, the pending async update (if any) delivers the selection instead
      isApplyingTextChange = false
    }

    return shouldChange
  }

  func textViewDidChangeSelection(_ textView: UITextView) {
    cancelPendingSelectionUpdate()
    textViewDelegate?.textViewDidChangeSelection?(textView)

    if isApplyingTextChange {
      // read in `textViewDidChange`; the async update is a fallback in case UIKit never sends it
      hasSkippedSelectionUpdate = true
      scheduleSelectionUpdate(for: textView)
      return
    }
    if textView.isUpdatingTextFromJS {
      // RN is re-applying the attributed string and will restore the selection in the same call
      scheduleSelectionUpdate(for: textView)
      return
    }

    sendSelectionPosition(for: textView)
  }

  func textViewDidChange(_ textView: UITextView) {
    defer {
      self.onTextChange(textView.text)
    }

    textViewDelegate?.textViewDidChange?(textView)

    isApplyingTextChange = false
    if hasSkippedSelectionUpdate {
      hasSkippedSelectionUpdate = false
      cancelPendingSelectionUpdate()
      sendSelectionPosition(for: textView)
    }
  }

  func textViewDidEndEditing(_ textView: UITextView) {
    resetSelectionTracking()
    textViewDelegate?.textViewDidEndEditing?(textView)
  }

  // MARK: selection dispatch

  private func sendSelectionPosition(for textView: UITextView) {
    // read the caret geometry before probing the layout: a `firstRect` query issued before `caretRect`
    // leaves TextKit 2 with an unpositioned paragraph fragment, and both caret rects then describe the old layout
    if let selection = textSelection(in: textView), textView.isSelectionLaidOut {
      onSelectionChange(selection)
    } else {
      // the caret is not laid out yet (the input has to grow first) - wait for the next layout pass
      scheduleSelectionUpdate(for: textView, after: UIUtils.nextFrame)
    }
  }

  private func scheduleSelectionUpdate(for textView: UITextView, after delay: TimeInterval = 0) {
    cancelPendingSelectionUpdate()

    let update = DispatchWorkItem { [weak self, weak textView] in
      guard let self = self else { return }
      self.pendingSelectionUpdate = nil
      self.isApplyingTextChange = false
      self.hasSkippedSelectionUpdate = false
      guard let textView = textView, textView.isFirstResponder, textView.delegate === self else { return }

      // read the current selection - a range captured earlier can be stale by now
      updateSelectionPosition(textInput: textView, sendEvent: self.onSelectionChange)
    }

    pendingSelectionUpdate = update
    if delay == 0 {
      DispatchQueue.main.async(execute: update)
    } else {
      DispatchQueue.main.asyncAfter(deadline: .now() + delay, execute: update)
    }
  }

  private func cancelPendingSelectionUpdate() {
    pendingSelectionUpdate?.cancel()
    pendingSelectionUpdate = nil
  }

  private func resetSelectionTracking() {
    cancelPendingSelectionUpdate()
    isApplyingTextChange = false
    hasSkippedSelectionUpdate = false
  }

  // MARK: UITextFieldDelegate

  @available(iOS 13.0, *)
  func textFieldDidChangeSelection(_ textField: UITextField) {
    textFieldDelegate?.textFieldDidChangeSelection?(textField)
    updateSelectionPosition(textInput: textField, sendEvent: onSelectionChange)
  }

  func textField(
    _ textField: UITextField,
    shouldChangeCharactersIn range: NSRange,
    replacementString string: String
  ) -> Bool {
    defer {
      self.onTextChange(textField.text)
    }

    if #unavailable(iOS 13.0) {
      DispatchQueue.main.asyncAfter(deadline: .now() + UIUtils.nextFrame) {
        updateSelectionPosition(textInput: textField, sendEvent: self.onSelectionChange)
      }
    }

    return textFieldDelegate?.textField?(textField, shouldChangeCharactersIn: range, replacementString: string) ?? true
  }

  func textFieldDidEndEditing(_ textField: UITextField) {
    textFieldDelegate?.textFieldDidEndEditing?(textField)

    if #unavailable(iOS 13.0) {
      removeSelectionRangeObserver(from: textField)
      if observedTextFieldForSelection === textField {
        observedTextFieldForSelection = nil
      }
    }
  }

  // MARK: KVO for iOS < 13

  private func addSelectionRangeObserver(to textField: UITextField) {
    textField.addObserver(
      self,
      forKeyPath: "selectedTextRange",
      options: [.new],
      context: nil
    )
  }

  private func removeSelectionRangeObserver(from textField: UITextField) {
    textField.removeObserver(self, forKeyPath: "selectedTextRange")
  }

  // swiftlint:disable:next block_based_kvo
  override func observeValue(
    forKeyPath keyPath: String?,
    of object: Any?,
    change: [NSKeyValueChangeKey: Any]?,
    context: UnsafeMutableRawPointer?
  ) {
    guard keyPath == "selectedTextRange", let textField = object as? UITextField else {
      super.observeValue(forKeyPath: keyPath, of: object, change: change, context: context)
      return
    }
    // selection changed => forward the event
    updateSelectionPosition(textInput: textField, sendEvent: onSelectionChange)
  }

  // MARK: call forwarding

  /// Decides whether `aSelector` should be forwarded to `delegate`.
  ///
  /// Usually we stay fully transparent and forward every selector the
  /// underlying delegate responds to. The exception is a field that acts as its
  /// own UIKit delegate and relays callbacks to an inner delegate through
  /// `forwardInvocation:` (e.g. `BKForwardingTextField`). For such a field
  /// `activeDelegate` is the text input *itself*, so it also "responds" to the
  /// many `UITextField` / `UITextView` methods that UIKit relays to its delegate
  /// (e.g. `keyboardInputChangedSelection:`). Forwarding one of those back to the
  /// field makes the field relay it to us again — an infinite recursion.
  ///
  /// To stay transparent without looping, when the delegate is the text input
  /// itself we forward only the selectors it handles *dynamically* (i.e. the
  /// ones it routes to its inner delegate via its own message forwarding), and
  /// never the ones it implements as a UIKit object. `instancesRespond(to:)`
  /// inspects the real method table only, so it is `false` exactly for the
  /// selectors resolved through the field's own `forwardInvocation:`.
  private func shouldForward(_ aSelector: Selector!, to delegate: AnyObject) -> Bool {
    guard delegate.responds(to: aSelector) else {
      return false
    }

    if delegate is UITextField || delegate is UITextView,
       let delegateClass = type(of: delegate) as? NSObject.Type
    {
      return !delegateClass.instancesRespond(to: aSelector)
    }

    return true
  }

  override func responds(to aSelector: Selector!) -> Bool {
    if super.responds(to: aSelector) {
      return true
    }
    guard let activeDelegate = activeDelegate else {
      return false
    }
    return shouldForward(aSelector, to: activeDelegate)
  }

  override func forwardingTarget(for aSelector: Selector!) -> Any? {
    if let activeDelegate = activeDelegate, shouldForward(aSelector, to: activeDelegate) {
      return activeDelegate
    }
    return super.forwardingTarget(for: aSelector)
  }

  override func doesNotRecognizeSelector(_ aSelector: Selector!) {
    let className = NSStringFromClass(type(of: self))
    let selectorName = NSStringFromSelector(aSelector)

    print("⚠️ [\(className)] does not recognize selector: \(selectorName)")

    if let delegate = activeDelegate {
      print("ℹ️ activeDelegate: \(type(of: delegate)) (responds: \(delegate.responds(to: aSelector)))")
    } else {
      print("ℹ️ activeDelegate is nil")
    }
  }
}
