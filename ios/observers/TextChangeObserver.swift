//
//  TextChangeObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 27/11/2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

class KeyboardControllerCompositeDelegate: NSObject, UITextViewDelegate, UITextFieldDelegate {
    weak var textViewDelegate: UITextViewDelegate?
    weak var textFieldDelegate: UITextFieldDelegate?
    
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
        // Additional code to handle text selection change
        if let selectedRange = textView.selectedTextRange, let selectedText = textView.text(in: selectedRange) {
            print("Selected Text in UITextView: \(selectedText)")
        }
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
        // Additional code to handle text selection change
        if let selectedRange = textField.selectedTextRange, let selectedText = textField.text(in: selectedRange) {
            print("Selected Text in UITextField: \(selectedText)")
        }
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
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        return textFieldDelegate?.textField?(textField, shouldChangeCharactersIn: range, replacementString: string) ?? true
    }
}

// single line - UITextField
// multiline - UITextView
public class TextChangeObserver {
  private var observer: Any?
  private let delegate = KeyboardControllerCompositeDelegate()

  func observeTextChanges(for input: UIResponder?, handler: @escaping (String?) -> Void) {
    if input == nil {
      return
    }
    if let textField = input as? UITextField {
        if (!(textField.delegate is KeyboardControllerCompositeDelegate)) {
            delegate.setTextFieldDelegate(delegate: textField.delegate)
            textField.delegate = delegate
        }
      observer = NotificationCenter.default.addObserver(
        forName: UITextField.textDidChangeNotification,
        object: textField,
        queue: nil
      ) { _ in
          print(textField.delegate)
        handler(textField.text)
      }
    } else if let textView = input as? UITextView {
        if (!(textView.delegate is KeyboardControllerCompositeDelegate)) {
            delegate.setTextViewDelegate(delegate: textView.delegate)
            (textView as? RCTUITextView)?.setForceDelegate(delegate)
        }
        print(textView.delegate)
      observer = NotificationCenter.default.addObserver(
        forName: UITextView.textDidChangeNotification,
        object: textView,
        queue: nil
      ) { _ in
          print(textView.delegate)
        handler(textView.text)
      }
    }
  }

  func removeObserver() {
    if let observer = observer {
      NotificationCenter.default.removeObserver(observer)
      self.observer = nil
    }
  }
}
