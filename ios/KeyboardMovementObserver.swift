//
//  KeyboardMovementObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 2.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation

@objc(KeyboardMovementObserver)
public class KeyboardMovementObserver: NSObject {
  // class members
  var onEvent: (NSString, NSNumber, NSNumber) -> Void
  var onNotify: (String, Any) -> Void
  // progress tracker
  private var _keyboardView: UIView?
  private var keyboardView: UIView? {
    let windowsCount = UIApplication.shared.windows.count

    if _keyboardView == nil || windowsCount != _windowsCount {
      _keyboardView = findKeyboardView()
      _windowsCount = windowsCount
    }

    return _keyboardView
  }

  private var _windowsCount: Int = 0
  private var prevKeyboardPosition = 0.0
  private var displayLink: CADisplayLink?
  private var keyboardHeight: CGFloat = 0.0

  @objc public init(
    handler: @escaping (NSString, NSNumber, NSNumber) -> Void,
    onNotify: @escaping (String, Any) -> Void
  ) {
    onEvent = handler
    self.onNotify = onNotify
  }

  @objc public func mount() {
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

  @objc public func unmount() {
    // swiftlint:disable notification_center_detachment
    NotificationCenter.default.removeObserver(self)
  }

  @objc func keyboardWillAppear(_ notification: Notification) {
    if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      self.keyboardHeight = keyboardHeight

      var data = [AnyHashable: Any]()
      data["height"] = keyboardHeight

      onEvent("onKeyboardMoveStart", Float(keyboardHeight) as NSNumber, 1)
      onNotify("KeyboardController::keyboardWillShow", data)

      setupKeyboardWatcher()
    }
  }

  @objc func keyboardWillDisappear() {
    var data = [AnyHashable: Any]()
    data["height"] = 0

    onEvent("onKeyboardMoveStart", 0, 0)
    onNotify("KeyboardController::keyboardWillHide", data)

    setupKeyboardWatcher()
  }

  @objc func keyboardDidAppear(_ notification: Notification) {
    if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      self.keyboardHeight = keyboardHeight

      var data = [AnyHashable: Any]()
      data["height"] = keyboardHeight

      onEvent("onKeyboardMoveEnd", keyboardHeight as NSNumber, 1)
      onNotify("KeyboardController::keyboardDidShow", data)

      removeKeyboardWatcher()
    }
  }

  @objc func keyboardDidDisappear() {
    var data = [AnyHashable: Any]()
    data["height"] = 0

    onEvent("onKeyboardMoveEnd", 0 as NSNumber, 0)
    onNotify("KeyboardController::keyboardDidHide", data)

    removeKeyboardWatcher()
  }

  @objc func setupKeyboardWatcher() {
    displayLink = CADisplayLink(target: self, selector: #selector(updateKeyboardFrame))
    displayLink?.preferredFramesPerSecond = 120 // will fallback to 60 fps for devices without Pro Motion display
    displayLink?.add(to: .main, forMode: .common)
  }

  @objc func removeKeyboardWatcher() {
    displayLink?.invalidate()
    displayLink = nil
  }

  // https://stackoverflow.com/questions/32598490/show-uiview-with-buttons-over-keyboard-like-in-skype-viber-messengers-swift-i
  func findKeyboardView() -> UIView? {
    var result: UIView?

    let windows = UIApplication.shared.windows
    for window in windows {
      if window.description.hasPrefix("<UITextEffectsWindow") {
        for subview in window.subviews {
          if subview.description.hasPrefix("<UIInputSetContainerView") {
            for hostView in subview.subviews {
              if hostView.description.hasPrefix("<UIInputSetHostView") {
                result = hostView as? UIView
                break
              }
            }
            break
          }
        }
        break
      }
    }
    return result
  }

  @objc func updateKeyboardFrame() {
    if keyboardView == nil {
      return
    }

    var keyboardFrameY = keyboardView?.layer.presentation()?.frame.origin.y ?? 0
    var keyboardWindowH = keyboardView?.window?.bounds.size.height ?? 0
    var keyboardPosition = keyboardWindowH - keyboardFrameY

    if keyboardPosition == prevKeyboardPosition || keyboardFrameY == 0 {
      return
    }

    prevKeyboardPosition = keyboardPosition
    onEvent("onKeyboardMove", keyboardPosition as NSNumber, keyboardPosition / CGFloat(keyboardHeight) as NSNumber)
  }
}
