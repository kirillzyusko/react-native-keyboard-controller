//
//  KeyboardMovementObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 2.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit

class SpringAnimation {
    private var zeta: Double // Damping ratio
    private var omega0: Double // Undamped angular frequency of the oscillator
    private var omega1: Double // Exponential decay
    private var v0: Double // Initial velocity

    private let stiffness: Double
    private let damping: Double
    private let mass: Double
    private let initialVelocity: Double
    private let fromValue: Double
    private let toValue: Double

    init(stiffness: Double, damping: Double, mass: Double, initialVelocity: Double, fromValue: Double, toValue: Double) {
        self.stiffness = stiffness
        self.damping = damping
        self.mass = mass
        self.initialVelocity = initialVelocity
        self.fromValue = fromValue
        self.toValue = toValue

        self.zeta = damping / (2 * sqrt(stiffness * mass)) // Damping ratio
        self.omega0 = sqrt(stiffness / mass) // Undamped angular frequency of the oscillator
        self.omega1 = omega0 * sqrt(1.0 - zeta * zeta) // Exponential decay
        self.v0 = -initialVelocity
    }

    func curveFunction(time t: Double) -> Double {
        let x0 = toValue - fromValue

        var y: Double
        if zeta < 1 {
            // Under damped
            let envelope = exp(-zeta * omega0 * t)
            y = toValue - envelope * (((v0 + zeta * omega0 * x0) / omega1) * sin(omega1 * t) + x0 * cos(omega1 * t))
        } else {
            // Critically damped
            let envelope = exp(-omega0 * t)
            y = toValue - envelope * (x0 + (v0 + omega0 * x0) * t)
        }

        return y
    }
    
    func approximateTiming(forValue y: Double) -> Double {
        var lowerBound: Double = 0.0
        var upperBound: Double = 1.0 // Assuming 1 second is the max duration for simplicity
        let tolerance: Double = 0.001 // Define how precise you want to be
        var tGuess: Double = 0.0

        while (upperBound - lowerBound) > tolerance {
            tGuess = (lowerBound + upperBound) / 2
            let currentValue = curveFunction(time: tGuess)

            if currentValue < y {
                lowerBound = tGuess
            } else {
                upperBound = tGuess
            }
        }

        return tGuess
    }
}

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
    var i = 1
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
      animation = SpringAnimation(stiffness: 1000, damping: 500, mass: 3, initialVelocity: 0, fromValue: 0, toValue: keyboardHeight)
      time = CACurrentMediaTime()
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
    displayLink?.add(to: .current, forMode: .default)
  }

  @objc func removeKeyboardWatcher() {
    displayLink?.invalidate()
    displayLink = nil
  }

  @objc func updateKeyboardFrame(displaylink: CADisplayLink) {
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
      if (diff == 0.0) {
          diff = CACurrentMediaTime() - time
      }
      let beginTime = keyboardView?.layer.animation(forKey: "position")?.beginTime ?? time
      let duration = displaylink.targetTimestamp - beginTime
      print("duration: \(duration) \(diff) \(displaylink.timestamp)")
      print("duration2: \(displaylink.timestamp - time)")
      let pos = animation?.curveFunction(time: displaylink.targetTimestamp - beginTime) as! NSNumber
      i += 1
      print("\(keyboardPosition) \(animation?.curveFunction(time: duration))")
      print("BeginTime:  \(beginTime) Time: \(time) Timestamp: \(displaylink.timestamp) TargetTimestamp: \(displaylink.targetTimestamp) Duration: \(duration)")
      print("--> CADisplayLink position: \(keyboardPosition), duration for CADisplayLink (reverse): \(animation?.approximateTiming(forValue: keyboardPosition)), CADisplayLink timestamp: \(displaylink.timestamp), CADisplayLink targetTimestamp: \(displaylink.targetTimestamp), Spring formula prediction: \(pos), at: \(duration)")
    onEvent(
      "onKeyboardMove",
      CGFloat(pos) as NSNumber,
      keyboardPosition / CGFloat(keyboardHeight) as NSNumber,
      duration as NSNumber,
      tag
    )
  }
}
