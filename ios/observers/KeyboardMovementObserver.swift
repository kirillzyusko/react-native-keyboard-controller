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
  private var interactiveKeyboardObserver: NSKeyValueObservation?
  private var isMounted = false
  // state variables
  private var _keyboardHeight: CGFloat = 0.0
  private var keyboardHeight: CGFloat {
    get { _keyboardHeight - KeyboardAreaExtender.shared.offset }
    set { _keyboardHeight = newValue }
  }

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
    guard interactiveKeyboardObserver == nil, let view = keyboardView else { return }

    interactiveKeyboardObserver = view.observe(\.center, options: .new) { [weak self] _, change in
      guard let self = self, let changeValue = change.newValue else { return }

      self.keyboardDidMoveInteractively(changeValue: changeValue)
    }
  }

  private func removeKVObserver() {
    interactiveKeyboardObserver?.invalidate()
    interactiveKeyboardObserver = nil
  }

  private func keyboardDidMoveInteractively(changeValue: CGPoint) {
    // if we are currently animating keyboard -> we need to ignore values from KVO
    if displayLink != nil {
      return
    }
    // if keyboard height is not equal to its bounds - we can ignore
    // values, since they'll be invalid and will cause UI jumps
    if floor(keyboardView?.bounds.size.height ?? 0) != floor(_keyboardHeight) {
      return
    }

    let keyboardFrameY = changeValue.y
    let keyboardWindowH = keyboardView?.window?.bounds.size.height ?? 0
    let keyboardPosition = keyboardWindowH - keyboardFrameY

    let position = CGFloat.interpolate(
      inputRange: [_keyboardHeight / 2, -_keyboardHeight / 2],
      outputRange: [_keyboardHeight, 0],
      currentValue: keyboardPosition
    ) - KeyboardAreaExtender.shared.offset

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

  @objc public func unmount() {
    isMounted = false
    // swiftlint:disable:next notification_center_detachment
    NotificationCenter.default.removeObserver(self)
  }

  @objc func keyboardWillAppear(_ notification: Notification) {
    guard !KeyboardEventsIgnorer.shared.shouldIgnore else { return }

    let (duration, frame) = notification.keyboardMetaData()
    if let keyboardFrame = frame {
      tag = UIResponder.current.reactViewTag
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      self.keyboardHeight = keyboardHeight
      self.duration = duration
      didShowDeadline = Date.currentTimeStamp + Int64(duration)

      onRequestAnimation()
      onEvent("onKeyboardMoveStart", Float(self.keyboardHeight) as NSNumber, 1, duration as NSNumber, tag)
      onNotify("KeyboardController::keyboardWillShow", buildEventParams(self.keyboardHeight, duration, tag))

      setupKeyboardWatcher()
      initializeAnimation(fromValue: prevKeyboardPosition, toValue: self.keyboardHeight)
    }
  }

  @objc func keyboardWillDisappear(_ notification: Notification) {
    let (duration, _) = notification.keyboardMetaData()
    tag = UIResponder.current.reactViewTag
    self.duration = duration

    onRequestAnimation()
    onEvent("onKeyboardMoveStart", 0, 0, duration as NSNumber, tag)
    onNotify("KeyboardController::keyboardWillHide", buildEventParams(0, duration, tag))

    setupKeyboardWatcher()
    removeKVObserver()
    initializeAnimation(fromValue: prevKeyboardPosition, toValue: 0)
  }

  @objc func keyboardDidAppear(_ notification: Notification) {
    let timestamp = Date.currentTimeStamp
    let (duration, frame) = notification.keyboardMetaData()
    if let keyboardFrame = frame {
      let (position, _) = keyboardView.frameTransitionInWindow
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      tag = UIResponder.current.reactViewTag
      self.keyboardHeight = keyboardHeight

      guard !KeyboardEventsIgnorer.shared.shouldIgnore else {
        KeyboardEventsIgnorer.shared.shouldIgnoreKeyboardEvents = false
        return
      }

      // if the event is caught in between it's highly likely that it could be a "resize" event
      // so we just read actual keyboard frame value in this case
      let height = timestamp >= didShowDeadline ? self.keyboardHeight : position - KeyboardAreaExtender.shared.offset
      // always limit progress to the maximum possible value
      let progress = min(height / self.keyboardHeight, 1.0)

      onCancelAnimation()
      onEvent("onKeyboardMoveEnd", height as NSNumber, progress as NSNumber, duration as NSNumber, tag)
      onNotify("KeyboardController::keyboardDidShow", buildEventParams(height, duration, tag))

      removeKeyboardWatcher()
      setupKVObserver()
      animation = nil
    }
  }

  @objc func keyboardDidDisappear(_ notification: Notification) {
    let (duration, _) = notification.keyboardMetaData()
    tag = UIResponder.current.reactViewTag

    onCancelAnimation()
    onEvent("onKeyboardMoveEnd", 0 as NSNumber, 0, duration as NSNumber, tag)
    onNotify("KeyboardController::keyboardDidHide", buildEventParams(0, duration, tag))

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

    let (visibleKeyboardHeight, keyboardFrameY) = keyboardView.frameTransitionInWindow
    var keyboardPosition = visibleKeyboardHeight - KeyboardAreaExtender.shared.offset

    if keyboardPosition == prevKeyboardPosition || keyboardFrameY == 0 {
      return
    }

    if animation == nil {
      initializeAnimation(fromValue: prevKeyboardPosition, toValue: keyboardHeight)
    }

    prevKeyboardPosition = keyboardPosition

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
}
