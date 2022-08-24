//
//  KeyboardObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 2.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation

@objc(KeyboardMovementObserver)
public class KeyboardMovementObserver: NSObject {
  var onEvent: (NSNumber, NSNumber) -> Void
  var onNotify: (String, Any) -> Void

  @objc public init(handler: @escaping (NSNumber, NSNumber) -> Void, onNotify: @escaping (String, Any) -> Void) {
    onEvent = handler
    self.onNotify = onNotify
  }

  @objc public func mount() {
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardWillDisappear),
      name: UIResponder.keyboardWillHideNotification,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardWillAppear),
      name: UIResponder.keyboardWillShowNotification,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardDidAppear),
      name: UIResponder.keyboardDidShowNotification,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardDidDisappear),
      name: UIResponder.keyboardDidHideNotification,
      object: nil
    )
  }

  @objc public func unmount() {
    // swiftlint:disable notification_center_detachment
    NotificationCenter.default.removeObserver(self)
  }

  @objc func keyboardWillAppear(_ notification: Notification) {
    if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
      let keyboardHeight = keyboardFrame.cgRectValue.size.height

      var data = [AnyHashable: Any]()
      data["height"] = keyboardHeight

      onEvent(Float(-keyboardHeight) as NSNumber, 1)
      onNotify("KeyboardController::keyboardWillShow", data)
    }
  }

  @objc func keyboardWillDisappear() {
    var data = [AnyHashable: Any]()
    data["height"] = 0

    onEvent(0, 0)
    onNotify("KeyboardController::keyboardWillHide", data)
  }

  @objc func keyboardDidAppear(_ notification: Notification) {
    if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
      let keyboardHeight = keyboardFrame.cgRectValue.size.height

      var data = [AnyHashable: Any]()
      data["height"] = keyboardHeight

      onNotify("KeyboardController::keyboardDidShow", data)
    }
  }

  @objc func keyboardDidDisappear() {
    var data = [AnyHashable: Any]()
    data["height"] = 0

    onNotify("KeyboardController::keyboardDidHide", data)
  }
}
