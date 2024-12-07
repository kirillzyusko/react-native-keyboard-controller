//
//  KeyboardControllerModuleImpl.swift
//  Pods
//
//  Created by Kiryl Ziusko on 19/11/2024.
//

import Foundation
import UIKit

@objc(KeyboardControllerModuleImpl)
public class KeyboardControllerModuleImpl: NSObject {
  @objc
  public static func dismiss(_ keepFocus: Bool) {
    guard let input = UIResponder.current as? TextInput else { return }

    if keepFocus {
      let tapGuesture = UITapGestureRecognizer(target: self, action: #selector(onTextInputTapped(_:)))
      input.addGestureRecognizer(tapGuesture)

      input.inputView = UIView()
      input.reloadInputViews()

      NotificationCenter.default.addObserver(
        self,
        selector: #selector(onResponderResigned(_:)),
        name: UITextField.textDidEndEditingNotification,
        object: input
      )
    } else {
      input.resignFirstResponder()
    }
  }

  @objc static func onTextInputTapped(_ gesture: UITapGestureRecognizer) {
    if gesture.state == .ended {
      guard let input = UIResponder.current as? TextInput else { return }

      // set your custom input view or nil for default keyboard
      input.inputView = nil
      input.reloadInputViews()

      input.removeGestureRecognizer(gesture)
      input.becomeFirstResponder()
    }
  }

  @objc static func onResponderResigned(_ notification: Notification) {
    guard let input = notification.object as? TextInput else { return }

    // Clear the custom `inputView` when the responder resigns
    input.inputView = nil
    input.reloadInputViews()

    // Clean up observer
    NotificationCenter.default.removeObserver(self, name: UITextField.textDidEndEditingNotification, object: input)
  }
}
