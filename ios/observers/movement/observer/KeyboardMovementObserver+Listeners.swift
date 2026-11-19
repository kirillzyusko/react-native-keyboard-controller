//
//  KeyboardMovementObserver+Listeners.swift
//  Pods
//
//  Created by Kiryl Ziusko on 07/08/2025.
//

extension KeyboardMovementObserver {
  @objc func keyboardWillAppear(_ notification: Notification) {
    guard !UIResponder.isKeyboardPreloading else { return }

    // UIKit announces a keyboard that belongs to nobody while it rearranges the input views of the screens
    if UIResponder.current == nil, isKeyboardInTransition || isScreenInTransition {
      return
    }

    if isAnimatedByItself(notification) {
      endTransition()
    }

    // the screen that gets revealed brings its own keyboard, but only if the transition gets finished
    if isKeyboardInTransition {
      transitionNotification = notification
      return
    }

    guard let transition = keyboardTransition(for: notification) else {
      return dispatchWillAppear(notification)
    }

    if transition.kind == .withScreen {
      // the keyboard arrives together with its screen, so the screen has to be ready before it becomes visible
      UIView.performWithoutAnimation { dispatchWillAppear(notification.withoutAnimation) }
    } else {
      dispatchWillAppear(notification)
    }

    restoredKeyboard = (tag, keyboardHeight)
  }

  func dispatchWillAppear(_ notification: Notification) {
    let (duration, frame) = notification.keyboardMetaData()
    if let keyboardFrame = frame {
      let responder = UIResponder.current.reactViewTag
      let keyboardHeight = keyboardFrame.cgRectValue.size.height

      guard !isOutdated(keyboardHeight, of: responder) else { return }

      tag = responder
      self.keyboardHeight = keyboardHeight
      self.notification = notification

      guard !KeyboardEventsIgnorer.shared.shouldIgnore else {
        KeyboardEventsIgnorer.shared.shouldIgnoreKeyboardEvents = false
        return
      }

      guard !isKeyboardRestored() else { return }

      self.duration = duration

      // foldable devices can emit `keyboardWillShow` with a `0` keyboard height when the device is rotated
      let progress: NSNumber = self.keyboardHeight > 0 ? 1 : 0

      onEvent("onKeyboardMoveStart", Float(self.keyboardHeight) as NSNumber, progress, duration as NSNumber, tag)
      onNotify("KeyboardController::keyboardWillShow", buildEventParams(self.keyboardHeight, duration, tag))

      setupKeyboardWatcher()
      initializeAnimation(fromValue: prevKeyboardPosition, toValue: self.keyboardHeight)
      scheduleDidEvent(height: self.keyboardHeight, duration: animation?.duration ?? CGFloat(duration) / 1000)
    }
  }

  @objc func keyboardWillDisappear(_ notification: Notification) {
    guard !UIResponder.isKeyboardPreloading, !isKeyboardInTransition else { return }
    restoredKeyboard = nil
    var (duration, _) = notification.keyboardMetaData()
    let transition = beginTransition(hidingKeyboardWith: notification)

    // the keyboard stays where it is on its screen, so there is nothing to change until the screen is gone
    if transition == .withScreen {
      return
    }

    // the keyboard goes down as long as the transition lasts, even if the notification has no duration
    if let coordinator = transitionCoordinator {
      duration = Int(coordinator.transitionDuration * 1000)
    }

    tag = UIResponder.current.reactViewTag
    self.notification = notification
    // when keyboard disappears immediately replace the keyboard frame with .zero
    // since this will be the final frame of the keyboard after animation
    self.notification?.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] =
      NSValue(cgRect: CGRect(x: 0, y: 0, width: 0, height: 0))
    self.duration = duration

    onEvent("onKeyboardMoveStart", 0, 0, duration as NSNumber, tag)
    onNotify("KeyboardController::keyboardWillHide", buildEventParams(0, duration, tag))

    setupKeyboardWatcher()
    removeKVObserver()
    initializeAnimation(fromValue: prevKeyboardPosition, toValue: 0)

    if transition == nil {
      scheduleDidEvent(height: 0, duration: animation?.duration ?? CGFloat(duration) / 1000)
    } else {
      // the keyboard is hidden when the transition is finished, not when `duration` elapses
      keyboardDidTask?.cancel()
    }
  }

  @objc func keyboardDidAppear(_ notification: Notification) {
    guard !UIResponder.isKeyboardPreloading else { return }

    let (duration, frame) = notification.keyboardMetaData()
    if let keyboardFrame = frame {
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      tag = UIResponder.current.reactViewTag
      self.keyboardHeight = keyboardHeight

      let height = self.keyboardHeight
      // always limit progress to the maximum possible value
      let progress = min(height / self.keyboardHeight, 1.0)

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

    onEvent("onKeyboardMoveEnd", 0 as NSNumber, 0, duration as NSNumber, tag)
    onNotify("KeyboardController::keyboardDidHide", buildEventParams(0, duration, tag))

    removeKeyboardWatcher()
    prevKeyboardPosition = 0
    animation = nil
  }

  @objc func scheduleDidEvent(height: CGFloat, duration: CGFloat) {
    keyboardDidTask?.cancel()

    guard let notification = notification else {
      return
    }

    let task = DispatchWorkItem { [weak self] in
      guard let self = self else { return }
      if height > 0 {
        self.keyboardDidAppear(notification)
      } else {
        self.keyboardDidDisappear(notification)
      }
    }

    keyboardDidTask = task
    DispatchQueue.main.asyncAfter(deadline: .now() + duration, execute: task)
  }
}
