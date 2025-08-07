//
//  KeyboardMovementObserver+Lifecycle.swift
//  Pods
//
//  Created by Kiryl Ziusko on 07/08/2025.
//

public extension KeyboardMovementObserver {
  @objc func mount() {
    if isMounted {
      return
    }

    isMounted = true

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

  @objc func unmount() {
    isMounted = false
    // swiftlint:disable:next notification_center_detachment
    NotificationCenter.default.removeObserver(self)
  }
}
