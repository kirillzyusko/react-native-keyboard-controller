//
//  TextChangeObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 27/11/2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

protocol NotifyingMaskedTextFieldDelegateListener: class {
    func onEditingChanged(inTextField: UITextField)
}

public class TextChangeObserver {
  private var observer: Any?

  func observeTextChanges(for input: UIResponder?, handler: @escaping (String?) -> Void) {
    if input == nil {
      return
    }
    if let textField = input as? UITextField {
      observer = NotificationCenter.default.addObserver(
        forName: UITextField.textDidChangeNotification,
        object: textField,
        queue: nil
      ) { _ in
        handler(textField.text)
      }
    } else if let textView = input as? UITextView {
      observer = NotificationCenter.default.addObserver(
        forName: UITextView.textDidChangeNotification,
        object: textView,
        queue: nil
      ) { _ in
        handler(textView.text)
      }
    }
      if let myProtocolView = input as? NotifyingMaskedTextFieldDelegateListener {
          print("conforms")
          // The view conforms to the MyProtocol
          // myProtocolView.onEditingChanged
      } else {
          // The view does not conform to the MyProtocol
      }
  }

  func removeObserver() {
    if let observer = observer {
      NotificationCenter.default.removeObserver(observer)
      self.observer = nil
    }
  }
}
