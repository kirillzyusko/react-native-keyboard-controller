//
//  KCTextInputCompositeDelegate.swift
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 24/04/2024.
//

import Foundation

func textSelection(in textInput: UITextInput) -> NSDictionary? {
  if let selectedRange = textInput.selectedTextRange {
    let caretRectStart = textInput.caretRect(for: selectedRange.start)
    let caretRectEnd = textInput.caretRect(for: selectedRange.end)

    return [
      "selection": [
        "start": [
          "x": caretRectStart.origin.x,
          "y": caretRectStart.origin.y,
          "position": textInput.offset(from: textInput.beginningOfDocument, to: selectedRange.start),
        ],
        "end": [
          "x": caretRectEnd.origin.x + caretRectEnd.size.width,
          "y": caretRectEnd.origin.y + caretRectEnd.size.height,
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

  // Keep track of which textField we’re observing (iOS < 13 only)
  private weak var observedTextFieldForSelection: UITextField?

  init(
    onSelectionChange: @escaping (_ event: NSDictionary) -> Void,
    onTextChange: @escaping (_ text: String?) -> Void
  ) {
    self.onSelectionChange = onSelectionChange
    self.onTextChange = onTextChange
  }

  // MARK: setters/getters

  func setTextViewDelegate(delegate: UITextViewDelegate?) {
    // remove KVO from any old textView
    if let oldTextField = observedTextFieldForSelection {
      removeSelectionRangeObserver(from: oldTextField)
    }

    textViewDelegate = delegate
    textFieldDelegate = nil
    observedTextFieldForSelection = nil
  }

  func setTextFieldDelegate(delegate: UITextFieldDelegate?, textField: UITextField?) {
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
    } else {
      if let realTextField = textField {
        addSelectionRangeObserver(to: realTextField)
        observedTextFieldForSelection = realTextField
      }
    }
  }

  func canSubstituteTextFieldDelegate(delegate: UITextFieldDelegate?) -> Bool {
    let type = String(describing: delegate)
    if type.range(of: "SQIPTextFieldInputModifier") != nil {
      // SQIPTextFieldInputModifier is a private class used internally by Square.
      // It forwards input events to the keyboard-controller delegate.
      // To prevent an infinite loop, we avoid setting our delegate in this case.
      // Since Square's SDK is used imperatively and doesn't allow adding custom components,
      // keyboard-controller components cannot be used in this context,
      // so it's safe to skip replacing the delegate.
      return false
    }

    return true
  }

  // Getter for the active delegate
  var activeDelegate: AnyObject? {
    return textViewDelegate ?? textFieldDelegate
  }

  // MARK: UITextViewDelegate

  func textViewDidChangeSelection(_ textView: UITextView) {
    textViewDelegate?.textViewDidChangeSelection?(textView)
    if textView.canSelectionFitIntoLayout {
      updateSelectionPosition(textInput: textView, sendEvent: onSelectionChange)
    } else {
      // when multiline input grows we need to wait for layout to be updated
      // otherwise start/end positions will be incorrect (0/-1)
      DispatchQueue.main.asyncAfter(deadline: .now() + UIUtils.nextFrame) {
        updateSelectionPosition(textInput: textView, sendEvent: self.onSelectionChange)
      }
    }
  }

  func textViewDidChange(_ textView: UITextView) {
    defer {
      self.onTextChange(textView.text)
    }

    textViewDelegate?.textViewDidChange?(textView)
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

  override func responds(to aSelector: Selector!) -> Bool {
    if super.responds(to: aSelector) {
      return true
    }
    return activeDelegate?.responds(to: aSelector) ?? false
  }

  override func forwardingTarget(for aSelector: Selector!) -> Any? {
    if activeDelegate?.responds(to: aSelector) ?? false {
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
