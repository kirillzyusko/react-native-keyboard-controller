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

  public init(
    onSelectionChange: @escaping (_ event: NSDictionary) -> Void,
    onTextChange: @escaping (_ text: String?) -> Void
  ) {
    self.onSelectionChange = onSelectionChange
    self.onTextChange = onTextChange
  }

  // MARK: setters/getters

  public func setTextViewDelegate(delegate: UITextViewDelegate?) {
    textViewDelegate = delegate
    textFieldDelegate = nil
  }

  public func setTextFieldDelegate(delegate: UITextFieldDelegate?) {
    textFieldDelegate = delegate
    textViewDelegate = nil
  }

  // Getter for the active delegate
  public var activeDelegate: AnyObject? {
    return textViewDelegate ?? textFieldDelegate
  }

  // MARK: UITextViewDelegate

  func textViewDidChangeSelection(_ textView: UITextView) {
    textViewDelegate?.textViewDidChangeSelection?(textView)
    updateSelectionPosition(textInput: textView, sendEvent: onSelectionChange)
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

    return textFieldDelegate?.textField?(textField, shouldChangeCharactersIn: range, replacementString: string) ?? true
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
}
