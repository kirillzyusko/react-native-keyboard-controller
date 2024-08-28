//
//  KeyboardMovementObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 2.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit

@objc(KeyboardMovementObserver)
public class KeyboardMovementObserver: NSObject {
  // class members
  var onEvent: (NSString, NSNumber, NSNumber, NSNumber, NSNumber) -> Void
  var onNotify: (String, Any) -> Void
  // animation
  var onRequestAnimation: () -> Void
  var onCancelAnimation: () -> Void
  // progress tracker
  private var _keyboardView: UIView?
  private var keyboardView: UIView? {
    let windowsCount = UIApplication.shared.windows.count

    if _keyboardView == nil || windowsCount != _windowsCount {
      _keyboardView = KeyboardView.find()
      _windowsCount = windowsCount
    }

    return _keyboardView
  }

  private var _windowsCount: Int = 0
  private var prevKeyboardPosition = 0.0
  private var displayLink: CADisplayLink?
  private var hasKVObserver = false
  private var isMounted = false
  // state variables
  private var keyboardHeight: CGFloat = 0.0
  private var duration = 0
  private var tag: NSNumber = -1
  private var animation: KeyboardAnimation?
  private var didShowDeadline: Int64 = 0

  @objc public init(
    handler: @escaping (NSString, NSNumber, NSNumber, NSNumber, NSNumber) -> Void,
    onNotify: @escaping (String, Any) -> Void,
    onRequestAnimation: @escaping () -> Void,
    onCancelAnimation: @escaping () -> Void
  ) {
    onEvent = handler
    self.onNotify = onNotify
    self.onRequestAnimation = onRequestAnimation
    self.onCancelAnimation = onCancelAnimation
  }

  @objc public func mount() {
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

  private func setupKVObserver() {
    if hasKVObserver {
      return
    }

    if keyboardView != nil {
      hasKVObserver = true
      keyboardView?.addObserver(self, forKeyPath: "center", options: .new, context: nil)
    }
  }

  private func removeKVObserver() {
    if !hasKVObserver {
      return
    }

    hasKVObserver = false
    _keyboardView?.removeObserver(self, forKeyPath: "center", context: nil)
  }

  // swiftlint:disable:next block_based_kvo
  @objc override public func observeValue(
    forKeyPath keyPath: String?,
    of object: Any?,
    change: [NSKeyValueChangeKey: Any]?,
    context _: UnsafeMutableRawPointer?
  ) {
    if keyPath == "center", object as? NSObject == _keyboardView {
      // if we are currently animating keyboard -> we need to ignore values from KVO
      if displayLink != nil {
        return
      }
      // if keyboard height is not equal to its bounds - we can ignore
      // values, since they'll be invalid and will cause UI jumps
      if keyboardView?.bounds.size.height != keyboardHeight {
        return
      }

      guard let changeValue = change?[.newKey] as? NSValue else {
        return
      }
      let keyboardFrameY = changeValue.cgPointValue.y
      let keyboardWindowH = keyboardView?.window?.bounds.size.height ?? 0
      let keyboardPosition = keyboardWindowH - keyboardFrameY
      let position = CGFloat.interpolate(
        inputRange: [keyboardHeight / 2, -keyboardHeight / 2],
        outputRange: [keyboardHeight, 0],
        currentValue: keyboardPosition
      )

      if position == 0 {
        // it will be triggered before `keyboardWillDisappear` and
        // we don't need to trigger `onInteractive` handler for that
        // since it will be handled in `keyboardWillDisappear` function
        return
      }

      prevKeyboardPosition = position

      onEvent(
        "onKeyboardMoveInteractive",
        position as NSNumber,
        position / CGFloat(keyboardHeight) as NSNumber,
        -1,
        tag
      )
    }
  }

  @objc public func unmount() {
    isMounted = false
    // swiftlint:disable:next notification_center_detachment
    NotificationCenter.default.removeObserver(self)
  }

  @objc func keyboardWillAppear(_ notification: Notification) {
    let (duration, frame) = metaDataFromNotification(notification)
    if let keyboardFrame = frame {
      tag = UIResponder.current.reactViewTag
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      self.keyboardHeight = keyboardHeight
      self.duration = duration
      didShowDeadline = Date.currentTimeStamp + Int64(duration)

      onRequestAnimation()
      onEvent("onKeyboardMoveStart", Float(keyboardHeight) as NSNumber, 1, duration as NSNumber, tag)
      onNotify("KeyboardController::keyboardWillShow", getEventParams(keyboardHeight, duration))

      setupKeyboardWatcher()
      initializeAnimation(fromValue: prevKeyboardPosition, toValue: keyboardHeight)
    }
  }

  @objc func keyboardWillDisappear(_ notification: Notification) {
    let (duration, _) = metaDataFromNotification(notification)
    tag = UIResponder.current.reactViewTag
    self.duration = duration

    onRequestAnimation()
    onEvent("onKeyboardMoveStart", 0, 0, duration as NSNumber, tag)
    onNotify("KeyboardController::keyboardWillHide", getEventParams(0, duration))

    setupKeyboardWatcher()
    removeKVObserver()
    initializeAnimation(fromValue: prevKeyboardPosition, toValue: 0)
  }

  @objc func keyboardDidAppear(_ notification: Notification) {
    let timestamp = Date.currentTimeStamp
    let (duration, frame) = metaDataFromNotification(notification)
    if let keyboardFrame = frame {
      let (position, _) = keyboardView.framePositionInWindow
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      tag = UIResponder.current.reactViewTag
      self.keyboardHeight = keyboardHeight
      // if the event is caught in between it's highly likely that it could be a "resize" event
      // so we just read actual keyboard frame value in this case
      let height = timestamp >= didShowDeadline ? keyboardHeight : position
      // always limit progress to the maximum possible value
      let progress = min(height / self.keyboardHeight, 1.0)

      onCancelAnimation()
      onEvent("onKeyboardMoveEnd", height as NSNumber, progress as NSNumber, duration as NSNumber, tag)
      onNotify("KeyboardController::keyboardDidShow", getEventParams(height, duration))

      removeKeyboardWatcher()
      setupKVObserver()
      animation = nil
    }
  }

  @objc func keyboardDidDisappear(_ notification: Notification) {
    let (duration, _) = metaDataFromNotification(notification)
    tag = UIResponder.current.reactViewTag

    onCancelAnimation()
    onEvent("onKeyboardMoveEnd", 0 as NSNumber, 0, duration as NSNumber, tag)
    onNotify("KeyboardController::keyboardDidHide", getEventParams(0, duration))

    removeKeyboardWatcher()
    animation = nil
  }

  @objc func setupKeyboardWatcher() {
    // sometimes `will` events can be called multiple times.
    // To avoid double re-creation of listener we are adding this condition
    // (if active link is present, then no need to re-setup a listener)
    if displayLink != nil {
      return
    }

    displayLink = CADisplayLink(target: self, selector: #selector(updateKeyboardFrame))
    displayLink?.preferredFramesPerSecond = 120 // will fallback to 60 fps for devices without Pro Motion display
    displayLink?.add(to: .main, forMode: .common)
  }

  @objc func removeKeyboardWatcher() {
    displayLink?.invalidate()
    displayLink = nil
  }

  func initializeAnimation(fromValue: Double, toValue: Double) {
    print("111 \(keyboardView?.layer.presentation()?.animationKeys())")
    for key in ["position", "opacity"] {
      if let keyboardAnimation = keyboardView?.layer.presentation()?.animation(forKey: key) {
        if let springAnimation = keyboardAnimation as? CASpringAnimation {
          animation = SpringAnimation(animation: springAnimation, fromValue: fromValue, toValue: toValue)
        } else if let basicAnimation = keyboardAnimation as? CABasicAnimation {
          animation = TimingAnimation(animation: basicAnimation, fromValue: fromValue, toValue: toValue)
        }
        return
      }
    }
  }

  @objc func updateKeyboardFrame(link: CADisplayLink) {
    if keyboardView == nil {
      return
    }

    let (visibleKeyboardHeight, keyboardFrameY) = keyboardView.framePositionInWindow
    var keyboardPosition = visibleKeyboardHeight

    if keyboardPosition == prevKeyboardPosition || keyboardFrameY == 0 {
      return
    }

    if animation == nil {
      initializeAnimation(fromValue: prevKeyboardPosition, toValue: keyboardHeight)
    }

    prevKeyboardPosition = keyboardPosition

    print(animation)

    if let animation = animation {
      let baseDuration = animation.timingAt(value: keyboardPosition)

      #if targetEnvironment(simulator)
        // on iOS simulator we can not use static interval
        // (from my observation from frame to frame we may have different delays)
        // so for now we use approximation - we add a difference as
        // beginTime - keyboardEventTime (but only in 0..0.016 range)
        // and it gives satisfactory results (better than static delays)
        let duration = baseDuration + animation.diff
      #else
        // 2 frames because we read previous frame, but need to calculate the next frame
        let duration = baseDuration + link.duration * 2
      #endif

      let position = CGFloat(animation.valueAt(time: duration))
      // handles a case when final frame has final destination (i. e. 0 or 291)
      // but CASpringAnimation can never get to this final destination
      let race: (CGFloat, CGFloat) -> CGFloat = animation.isIncreasing ? max : min
      keyboardPosition = race(position, keyboardPosition)
    }

    onEvent(
      "onKeyboardMove",
      keyboardPosition as NSNumber,
      keyboardPosition / CGFloat(keyboardHeight) as NSNumber,
      duration as NSNumber,
      tag
    )
  }

  private func metaDataFromNotification(_ notification: Notification) -> (Int, NSValue?) {
    let duration = Int(
      (notification.userInfo?[UIResponder.keyboardAnimationDurationUserInfoKey] as? Double ?? 0) * 1000
    )
    let keyboardFrame = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue

    return (duration, keyboardFrame)
  }

  private func getEventParams(_ height: Double, _ duration: Int) -> [AnyHashable: Any] {
    var data = [AnyHashable: Any]()
    data["height"] = height
    data["duration"] = duration
    data["timestamp"] = Date.currentTimeStamp
    data["target"] = tag

    return data
  }
}
