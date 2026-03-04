//
//  KeyboardMovementObserver+Listeners.swift
//  Pods
//
//  Created by Kiryl Ziusko on 07/08/2025.
//

extension KeyboardMovementObserver {
  private func emitKeyboardDidAppear(height: CGFloat, duration: Int) {
    let progress = 1.0

    onCancelAnimation()
    onEvent("onKeyboardMoveEnd", height as NSNumber, progress as NSNumber, duration as NSNumber, tag)
    onNotify("KeyboardController::keyboardDidShow", buildEventParams(height, duration, tag))

    removeKeyboardWatcher()
    setupKVObserver()
    animation = nil
  }

  private func emitKeyboardDidDisappear(duration: Int) {
    onCancelAnimation()
    onEvent("onKeyboardMoveEnd", 0 as NSNumber, 0, duration as NSNumber, tag)
    onNotify("KeyboardController::keyboardDidHide", buildEventParams(0, duration, tag))

    removeKeyboardWatcher()
    animation = nil
  }

  private func currentKeyboardHeight() -> CGFloat {
    let (visibleKeyboardHeight, _) = keyboardTrackingView.view.frameTransitionInWindow
    return max(CGFloat(visibleKeyboardHeight) - KeyboardAreaExtender.shared.offset, 0)
  }

  @objc func keyboardWillAppear(_ notification: Notification) {
    guard !UIResponder.isKeyboardPreloading else { return }

    let (duration, frame) = notification.keyboardMetaData()
    if let keyboardFrame = frame {
      tag = UIResponder.current.reactViewTag
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      self.keyboardHeight = keyboardHeight
      self.notification = notification

      guard !KeyboardEventsIgnorer.shared.shouldIgnore else {
        KeyboardEventsIgnorer.shared.shouldIgnoreKeyboardEvents = false
        return
      }

      self.duration = duration

      onRequestAnimation()
      onEvent("onKeyboardMoveStart", Float(self.keyboardHeight) as NSNumber, 1, duration as NSNumber, tag)
      onNotify("KeyboardController::keyboardWillShow", buildEventParams(self.keyboardHeight, duration, tag))

      setupKeyboardWatcher()
      initializeAnimation(fromValue: prevKeyboardPosition, toValue: self.keyboardHeight)
      scheduleDidEvent(height: self.keyboardHeight, duration: animation?.duration ?? CGFloat(duration) / 1000)
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
    scheduleDidEvent(height: 0, duration: animation?.duration ?? CGFloat(duration) / 1000)
  }

  @objc func keyboardDidAppear(_ notification: Notification) {
    guard !UIResponder.isKeyboardPreloading else { return }

    let (duration, frame) = notification.keyboardMetaData()
    if let keyboardFrame = frame {
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      tag = UIResponder.current.reactViewTag
      self.keyboardHeight = keyboardHeight

      emitKeyboardDidAppear(height: self.keyboardHeight, duration: duration)

      NotificationCenter.default.post(
        name: .keyboardDidAppear, object: notification, userInfo: nil
      )
    }
  }

  @objc func keyboardDidDisappear(_ notification: Notification) {
    guard !UIResponder.isKeyboardPreloading else { return }
    let (duration, _) = notification.keyboardMetaData()
    tag = UIResponder.current.reactViewTag

    emitKeyboardDidDisappear(duration: duration)
  }

  @objc func scheduleDidEvent(height targetHeight: CGFloat, duration: CGFloat) {
    keyboardDidTask?.cancel()
    keyboardDidEventID += 1
    let eventID = keyboardDidEventID
    _ = targetHeight

    guard let notification = notification else {
      return
    }

    let task = DispatchWorkItem { [weak self] in
      guard let self = self else { return }
      guard self.isMounted, eventID == self.keyboardDidEventID else { return }

      let duration = self.duration
      let currentHeight = self.currentKeyboardHeight()
      self.tag = UIResponder.current.reactViewTag

      if currentHeight > 0 {
        self.keyboardHeight = currentHeight
        self.emitKeyboardDidAppear(height: currentHeight, duration: duration)

        NotificationCenter.default.post(
          name: .keyboardDidAppear, object: notification, userInfo: nil
        )
      } else {
        self.emitKeyboardDidDisappear(duration: duration)
      }
    }

    keyboardDidTask = task
    DispatchQueue.main.asyncAfter(deadline: .now() + duration, execute: task)
  }
}
