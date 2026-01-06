//
//  KeyboardMovementObserver+Listeners.swift
//  Pods
//
//  Created by Kiryl Ziusko on 07/08/2025.
//

extension KeyboardMovementObserver {
  @objc func keyboardWillAppear(_ notification: Notification) {
    guard !KeyboardEventsIgnorer.shared.shouldIgnore, !UIResponder.isKeyboardPreloading else { return }

    let (duration, frame) = notification.keyboardMetaData()
    if let keyboardFrame = frame {
      tag = UIResponder.current.reactViewTag
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      self.keyboardHeight = keyboardHeight
      self.notification = notification
      self.duration = duration

      onRequestAnimation()
      onEvent("onKeyboardMoveStart", Float(self.keyboardHeight) as NSNumber, 1, duration as NSNumber, tag)
      onNotify("KeyboardController::keyboardWillShow", buildEventParams(self.keyboardHeight, duration, tag))

      setupKeyboardWatcher()
      initializeAnimation(fromValue: prevKeyboardPosition, toValue: self.keyboardHeight)
    }
  }

  @objc func keyboardWillDisappear(_ notification: Notification) {
    guard !UIResponder.isKeyboardPreloading else { return }
    let (duration, _) = notification.keyboardMetaData()
    tag = UIResponder.current.reactViewTag
    self.notification = notification
    // when keyboard disappears immediately replace the keyboard frame with .zero
    // since this will be the final frame of the keyboard after animation
    self.notification?.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] =
      NSValue(cgRect: CGRect(x: 0, y: 0, width: 0, height: 0))
    self.duration = duration

    onRequestAnimation()
    onEvent("onKeyboardMoveStart", 0, 0, duration as NSNumber, tag)
    onNotify("KeyboardController::keyboardWillHide", buildEventParams(0, duration, tag))

    setupKeyboardWatcher()
    removeKVObserver()
    initializeAnimation(fromValue: prevKeyboardPosition, toValue: 0)
  }

  @objc func keyboardDidAppear(_ notification: Notification) {
    guard !UIResponder.isKeyboardPreloading else { return }

    let (duration, frame) = notification.keyboardMetaData()
    if let keyboardFrame = frame {
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      tag = UIResponder.current.reactViewTag
      self.keyboardHeight = keyboardHeight

      guard !KeyboardEventsIgnorer.shared.shouldIgnore else {
        KeyboardEventsIgnorer.shared.shouldIgnoreKeyboardEvents = false
        return
      }

      let height = self.keyboardHeight - KeyboardAreaExtender.shared.offset
      // always limit progress to the maximum possible value
      let progress = min(height / self.keyboardHeight, 1.0)

      onCancelAnimation()
      onEvent("onKeyboardMoveEnd", height as NSNumber, progress as NSNumber, duration as NSNumber, tag)
      onNotify("KeyboardController::keyboardDidShow", buildEventParams(height, duration, tag))

      removeKeyboardWatcher()
      setupKVObserver()
      animation = nil

      NotificationCenter.default.post(
        name: .keyboardDidAppear, object: notification, userInfo: nil
      )
    }
  }

  @objc func keyboardDidDisappear(_ notification: Notification) {
    guard !UIResponder.isKeyboardPreloading else { return }
    let (duration, _) = notification.keyboardMetaData()
    tag = UIResponder.current.reactViewTag

    onCancelAnimation()
    onEvent("onKeyboardMoveEnd", 0 as NSNumber, 0, duration as NSNumber, tag)
    onNotify("KeyboardController::keyboardDidHide", buildEventParams(0, duration, tag))

    removeKeyboardWatcher()
    animation = nil
  }
}
