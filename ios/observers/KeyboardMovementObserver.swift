//
//  KeyboardMovementObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 2.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit

// swiftlint:disable:next identifier_name
let ONE_FRAME = 1.0 / 60

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
  private var animation: SpringAnimation?
  private var time = CACurrentMediaTime()
  private var diff = 0.0

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
    if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
      tag = UIResponder.current.reactViewTag
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      let duration = Int(
        (notification.userInfo?[UIResponder.keyboardAnimationDurationUserInfoKey] as? Double ?? 0) * 1000
      )
      self.keyboardHeight = keyboardHeight
      self.duration = duration

      var data = [AnyHashable: Any]()
      data["height"] = keyboardHeight
      data["duration"] = duration
      data["timestamp"] = Date.currentTimeStamp
      data["target"] = tag

      onRequestAnimation()
      onEvent("onKeyboardMoveStart", Float(keyboardHeight) as NSNumber, 1, duration as NSNumber, tag)
      onNotify("KeyboardController::keyboardWillShow", data)

      setupKeyboardWatcher()
      initializeAnimation(fromValue: 0, toValue: keyboardHeight)
    }
  }

  @objc func keyboardWillDisappear(_ notification: Notification) {
    let duration = Int(
      (notification.userInfo?[UIResponder.keyboardAnimationDurationUserInfoKey] as? Double ?? 0) * 1000
    )
    tag = UIResponder.current.reactViewTag
    self.duration = duration

    var data = [AnyHashable: Any]()
    data["height"] = 0
    data["duration"] = duration
    data["timestamp"] = Date.currentTimeStamp
    data["target"] = tag

    onRequestAnimation()
    onEvent("onKeyboardMoveStart", 0, 0, duration as NSNumber, tag)
    onNotify("KeyboardController::keyboardWillHide", data)

    setupKeyboardWatcher()
    removeKVObserver()
    initializeAnimation(fromValue: keyboardHeight, toValue: 0)
  }

  @objc func keyboardDidAppear(_ notification: Notification) {
    if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      tag = UIResponder.current.reactViewTag
      self.keyboardHeight = keyboardHeight
      let duration = Int(
        (notification.userInfo?[UIResponder.keyboardAnimationDurationUserInfoKey] as? Double ?? 0) * 1000
      )

      var data = [AnyHashable: Any]()
      data["height"] = keyboardHeight
      data["duration"] = duration
      data["timestamp"] = Date.currentTimeStamp
      data["target"] = tag

      onCancelAnimation()
      onEvent("onKeyboardMoveEnd", keyboardHeight as NSNumber, 1, duration as NSNumber, tag)
      onNotify("KeyboardController::keyboardDidShow", data)

      removeKeyboardWatcher()
      setupKVObserver()

      diff = 0.0
    }
  }

  @objc func keyboardDidDisappear(_ notification: Notification) {
    let duration = Int(
      (notification.userInfo?[UIResponder.keyboardAnimationDurationUserInfoKey] as? Double ?? 0) * 1000
    )
    tag = UIResponder.current.reactViewTag
    var data = [AnyHashable: Any]()
    data["height"] = 0
    data["duration"] = duration
    data["timestamp"] = Date.currentTimeStamp
    data["target"] = tag

    onCancelAnimation()
    onEvent("onKeyboardMoveEnd", 0 as NSNumber, 0, duration as NSNumber, tag)
    onNotify("KeyboardController::keyboardDidHide", data)

    removeKeyboardWatcher()
    diff = 0.0
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
    print("initializeAnimation from: \(fromValue) to: \(toValue)")
    let anim = keyboardView?.layer.presentation()?.animation(forKey: "position") as? CASpringAnimation
    guard let keyboardAnimation = anim else {
      // TODO: set animation to null here? Check how it works with modal windows
      return
    }
    animation = SpringAnimation(animation: keyboardAnimation, fromValue: fromValue, toValue: toValue)
    time = CACurrentMediaTime()
  }

  @objc func updateKeyboardFrame(link: CADisplayLink) {
    if keyboardView == nil {
      return
    }

    let keyboardFrameY = keyboardView?.layer.presentation()?.frame.origin.y ?? 0
    let keyboardWindowH = keyboardView?.window?.bounds.size.height ?? 0
    let keyboardPosition = keyboardWindowH - keyboardFrameY

    if keyboardPosition == prevKeyboardPosition || keyboardFrameY == 0 {
      return
    }

    prevKeyboardPosition = keyboardPosition
    if diff == 0.0 {
      diff = link.timestamp - time
    }
    let anim = keyboardView?.layer.animation(forKey: "position")
    // animation hasn't started yet, so we ignore this frame
    if anim?.beginTime == 0.0 {
      return
    }
    // when concurrent animation happens, then `.beginTime` remains the same
    let beginTime = max(anim?.beginTime ?? time, time)
    let baseDuration = link.targetTimestamp - beginTime

    #if targetEnvironment(simulator)
      let correctedDuration = baseDuration - ONE_FRAME * 0.6
    #else
      // TODO: check on iPhone 14 Pro (ProMotion display)
      let correctedDuration = baseDuration + ONE_FRAME
    #endif

    let duration = correctedDuration
    print("duration: \(duration) \(diff) \(link.timestamp)")
    print("duration2: \(link.timestamp - time)")
    let pos = CGFloat(animation?.curveFunction(time: duration) ?? 0)
    print("BeginTime:  \(beginTime) Time: \(time)")
    print("--> CADisplayLink position: \(keyboardPosition), duration for CADisplayLink (reverse): \(animation?.approximateTiming(forValue: keyboardPosition)), CADisplayLink timestamp: \(link.timestamp), CADisplayLink targetTimestamp: \(link.targetTimestamp), Spring formula prediction: \(pos), at: \(duration) anim?.beginTime: \(anim?.beginTime) time: \(time) speed: \(anim?.speed)")
    onEvent(
      "onKeyboardMove",
      pos as NSNumber,
      pos / CGFloat(keyboardHeight) as NSNumber,
      self.duration as NSNumber,
      tag
    )
  }
}
