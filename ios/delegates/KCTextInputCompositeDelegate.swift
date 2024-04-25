//
//  KCTextInputCompositeDelegate.swift
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 24/04/2024.
//

import Foundation

struct SelectionCoordinates {
  var start: Int
  var startX: CGFloat
  var startY: CGFloat
  var end: Int
  var endX: CGFloat
  var endY: CGFloat
}

func textSelectionCoordinates(in textInput: UITextInput) -> SelectionCoordinates? {
  if let selectedRange = textInput.selectedTextRange {
    let caretRectStart = textInput.caretRect(for: selectedRange.start)
    let caretRectEnd = textInput.caretRect(for: selectedRange.end)

    let coordinates = SelectionCoordinates(
      start: textInput.offset(from: textInput.beginningOfDocument, to: selectedRange.start),
      startX: caretRectStart.origin.x,
      startY: caretRectStart.origin.y,
      end: textInput.offset(from: textInput.beginningOfDocument, to: selectedRange.end),
      endX: caretRectEnd.origin.x + caretRectEnd.size.width,
      endY: caretRectEnd.origin.y + caretRectEnd.size.height
    )

    return coordinates
  }

  return nil
}

// TODO: unset delegate of unfocus?

/**
 * A delegate that is being set to any focused input
 * and intercepts some specific events that needs to be handled
 * for universal keyboard avoiding solutions (such as text selection etc.)
 * and forward all calls to underlying delegate
 */
class KCTextInputCompositeDelegate: NSObject, UITextViewDelegate, UITextFieldDelegate {
  // constructor members
  var onSelectionChange: (_ event: NSDictionary) -> Void
  // delegates
  weak var textViewDelegate: UITextViewDelegate?
  weak var textFieldDelegate: UITextFieldDelegate?

  // TODO: weak references
  public init(onSelectionChange: @escaping (_ event: NSDictionary) -> Void) {
    self.onSelectionChange = onSelectionChange
  }

  public func setTextViewDelegate(delegate: UITextViewDelegate?) {
    textViewDelegate = delegate
    textFieldDelegate = nil
  }

  public func setTextFieldDelegate(delegate: UITextFieldDelegate?) {
    textFieldDelegate = delegate
    textViewDelegate = nil
  }

  // MARK: UITextViewDelegate

  func textViewDidChangeSelection(_ textView: UITextView) {
    textViewDelegate?.textViewDidChangeSelection?(textView)
    updateSelectionPosition(textInput: textView)
  }

  // Implement other UITextViewDelegate methods as needed, forwarding to textViewDelegate

  func textViewDidChange(_ textView: UITextView) {
    textViewDelegate?.textViewDidChange?(textView)
  }

  func textViewDidEndEditing(_ textView: UITextView) {
    textViewDelegate?.textViewDidEndEditing?(textView)
  }

  func textViewDidBeginEditing(_ textView: UITextView) {
    textViewDelegate?.textViewDidBeginEditing?(textView)
  }

  func textViewShouldEndEditing(_ textView: UITextView) -> Bool {
    return textViewDelegate?.textViewShouldEndEditing?(textView) ?? true
  }

  func textViewShouldBeginEditing(_ textView: UITextView) -> Bool {
    return textViewDelegate?.textViewShouldEndEditing?(textView) ?? true
  }

  func textView(_ textView: UITextView, shouldChangeTextIn range: NSRange, replacementText text: String) -> Bool {
    return textViewDelegate?.textView?(textView, shouldChangeTextIn: range, replacementText: text) ?? true
  }

  @available(iOS 16.0, *)
  func textView(_ textView: UITextView, willDismissEditMenuWith animator: any UIEditMenuInteractionAnimating) {
    textViewDelegate?.textView?(textView, willDismissEditMenuWith: animator)
  }

  // MARK: UITextFieldDelegate

  func textFieldDidChangeSelection(_ textField: UITextField) {
    textFieldDelegate?.textFieldDidChangeSelection?(textField)
    updateSelectionPosition(textInput: textField)
  }

  // Implement other UITextFieldDelegate methods as needed, forwarding to textFieldDelegate
  func textFieldShouldClear(_ textField: UITextField) -> Bool {
    return textFieldDelegate?.textFieldShouldClear?(textField) ?? true
  }

  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    return textFieldDelegate?.textFieldShouldReturn?(textField) ?? true
  }

  func textFieldShouldEndEditing(_ textField: UITextField) -> Bool {
    return textFieldDelegate?.textFieldShouldEndEditing?(textField) ?? true
  }

  func textFieldShouldBeginEditing(_ textField: UITextField) -> Bool {
    return textFieldDelegate?.textFieldShouldBeginEditing?(textField) ?? true
  }

  func textFieldDidEndEditing(_ textField: UITextField) {
    textFieldDelegate?.textFieldDidEndEditing?(textField)
  }

  func textFieldDidBeginEditing(_ textField: UITextField) {
    textFieldDelegate?.textFieldDidBeginEditing?(textField)
  }

  func textField(
    _ textField: UITextField,
    shouldChangeCharactersIn range: NSRange,
    replacementString string: String
  ) -> Bool {
    return textFieldDelegate?.textField?(textField, shouldChangeCharactersIn: range, replacementString: string) ?? true
  }

  // MARK: Private functions

  private func updateSelectionPosition(textInput: UITextInput) {
    // TODO: better to rename varialbes/function
    if let coordinates = textSelectionCoordinates(in: textInput) {
      onSelectionChange([
        "selection": [
          "start": [
            "x": coordinates.startX,
            "y": coordinates.startY,
            "position": coordinates.start,
          ],
          "end": [
            "x": coordinates.endX,
            "y": coordinates.endY,
            "position": coordinates.end,
          ],
        ],
        "target": UIResponder.current.reactViewTag,
      ])
    }
  }
}
