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
  private static let keyboardRevealGestureName = "keyboardRevealGesture"

  @objc
  public static func dismiss(_ keepFocus: Bool) {
    guard let input = UIResponder.current as? TextInput else { return }

    if keepFocus {
      let tapGesture = UITapGestureRecognizer(target: self, action: #selector(onTextInputTapped(_:)))
      tapGesture.name = keyboardRevealGestureName
      input.addGestureRecognizer(tapGesture)

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

      cleanup(input)

      input.becomeFirstResponder()
    }
  }

  @objc static func onResponderResigned(_ notification: Notification) {
    guard let input = notification.object as? TextInput else { return }

    cleanup(input)
  }

  static func cleanup(_ input: TextInput) {
    input.inputView = nil
    input.reloadInputViews()

    if let gestures = input.gestureRecognizers {
      for gesture in gestures where gesture.name == keyboardRevealGestureName {
        input.removeGestureRecognizer(gesture)
      }
    }

    NotificationCenter.default.removeObserver(self, name: UITextField.textDidEndEditingNotification, object: input)
  }
}
