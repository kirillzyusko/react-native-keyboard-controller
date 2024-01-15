//
//  TextChangeObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 27/11/2023.
//  Copyright © 2023 Facebook. All rights reserved.
//


protocol NotifyingMaskedTextFieldDelegateListener: AnyObject {
    func onEditingChanged(inTextField: UITextField)
}

class MaskedTextChangeObserver: NotifyingMaskedTextFieldDelegateListener {
    private let textChangeHandler: (String?) -> Void

    init(textChangeHandler: @escaping (String?) -> Void) {
        self.textChangeHandler = textChangeHandler
    }

    func onEditingChanged(inTextField: UITextField) {
        // Implement your behavior here
        // You can access the text property of the UITextField to get the current text
        textChangeHandler(inTextField.text)
    }
}

public class TextChangeObserver {
  private var observer: Any?

  func observeTextChanges(for input: UIResponder?, handler: @escaping (String?) -> Void) {
    if input == nil {
      return
    }
    if let textField = input as? UITextField {
        let observer1 = MaskedTextChangeObserver(textChangeHandler: handler)

            // Set the observer as the editingListener for the existing delegate
        if let existingDelegate = textField.delegate as? NotifyingMaskedTextFieldDelegate {
                existingDelegate.editingListener = observer1
            }
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
    
    func onEditingChanged(inTextField: UITextField) {
            // Your implementation here
            print("Text field editing changed")
        }
}
