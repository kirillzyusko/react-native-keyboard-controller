//
//  Notification.swift
//  Pods
//
//  Created by Kiryl Ziusko on 04/11/2024.
//

extension Notification {
  func keyboardMetaData() -> (Int, NSValue?) {
    let duration = Int(
      (userInfo?[UIResponder.keyboardAnimationDurationUserInfoKey] as? Double ?? 0) * 1000
    )
    let keyboardFrame = userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue

    return (duration, keyboardFrame)
  }
}

extension Notification.Name {
  static let shouldIgnoreKeyboardEvents = Notification.Name("shouldIgnoreKeyboardEvents")
}
