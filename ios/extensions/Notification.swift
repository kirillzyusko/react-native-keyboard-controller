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

  /// The same keyboard notification, but with zero animation duration.
  var withoutAnimation: Notification {
    var notification = self
    notification.userInfo?[UIResponder.keyboardAnimationDurationUserInfoKey] = 0.0
    return notification
  }

  /// The same keyboard notification, but the keyboard is lower by `height`.
  func withKeyboard(loweredBy height: CGFloat) -> Notification {
    guard let frame = keyboardMetaData().1?.cgRectValue else { return self }
    let lowered = CGRect(x: frame.minX, y: frame.minY + height, width: frame.width, height: frame.height - height)

    var notification = self
    notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] = NSValue(cgRect: lowered)
    return notification
  }
}

extension Notification.Name {
  static let shouldIgnoreKeyboardEvents = Notification.Name("shouldIgnoreKeyboardEvents")
  static let keyboardDidAppear = Notification.Name("keyboardDidAppear")
}
