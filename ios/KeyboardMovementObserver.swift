//
//  KeyboardMovementObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 2.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation

func interpolate(inputRange: [CGFloat], outputRange: [CGFloat], currentValue: CGFloat) -> CGFloat {
    let inputMin = inputRange.min() ?? 0
    let inputMax = inputRange.max() ?? 1
    let outputMin = outputRange.min() ?? 0
    let outputMax = outputRange.max() ?? 1
    
    let normalizedValue = (currentValue - inputMin) / (inputMax - inputMin)
    let interpolatedValue = outputMin + (outputMax - outputMin) * normalizedValue
    
    return interpolatedValue
}



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
      print(interpolate(inputRange: [0.0, 50.0, 100.0], outputRange: [0.0, 50.0, 200.0], currentValue: 75.0)) // 150
      print(interpolate(inputRange: [-100.0, 0, 100.0], outputRange: [0.0, 20.0, 200.0], currentValue: -50.0)) // 10
      print(interpolate(inputRange: [-100.0, 0, 100.0], outputRange: [0.0, 20.0, 200.0], currentValue: 50)) // 110
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
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(windowDidBecomeVisible),
      name: UIWindow.didBecomeVisibleNotification,
      object: nil
    )
  }
    
    @objc func windowDidBecomeVisible(_ notification: Notification) {
            print(1111188)
            /*if (displayLink == nil) {
                return;
            }*/

            let keyboardView = self.findKeyboardView();

            if (keyboardView == _keyboardView) {
                    return;
                }

            _keyboardView = keyboardView;

            keyboardView?.addObserver(self, forKeyPath: "center", options: .new, context: nil)
        }
    
    @objc public override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {

        if keyPath == "center" && object as! NSObject == _keyboardView! {
            if (displayLink != nil || keyboardHeight == 0.0) {
                    // setupKeyboardWatcher()
                    // TODO: if keyboard is not shown yet or we are currently animating keyboard -> we need to ignore values from KVO
                    return
                }
                let keyboardFrameY = ((change?[.newKey]) as! NSValue).cgPointValue.y
                print(((change?[.newKey]) as! NSValue).cgPointValue.y)
                print(777777, _keyboardView?.layer.presentation()?.frame.origin.y, keyboardFrameY)
                let keyboardWindowH = keyboardView?.window?.bounds.size.height ?? 0
                let keyboardPosition = keyboardWindowH - keyboardFrameY
                let position = interpolate(inputRange: [keyboardHeight/2,-keyboardHeight/2], outputRange: [keyboardHeight, 0], currentValue: keyboardPosition)
                // self.updateKeyboardFrame()
                /*let age = change?[.newKey] {
                    // print("New age is: \(age)")
                    self.updateKeyboardFrame()
             }*/
                print(keyboardPosition)
                onEvent("onKeyboardMoveInteractive", position as NSNumber, position / CGFloat(keyboardHeight) as NSNumber)
            }
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

    // TODO: remove interactive listener
    // keyboardView?.removeObserver(self, forKeyPath: "center")
  }

  @objc func keyboardDidAppear(_ notification: Notification) {
    if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      self.keyboardHeight = keyboardHeight

      var data = [AnyHashable: Any]()
      data["height"] = keyboardHeight

      onEvent("onKeyboardMoveEnd", keyboardHeight as NSNumber, 1)
      onNotify("KeyboardController::keyboardDidShow", data)

      // keyboardView?.addObserver(self, forKeyPath: "center", options: .new, context: nil)
        
      removeKeyboardWatcher()
    }
  }

  @objc func keyboardDidDisappear() {
    var data = [AnyHashable: Any]()
    data["height"] = 0
      
    keyboardHeight = 0.0

    onEvent("onKeyboardMoveEnd", 0 as NSNumber, 0)
    onNotify("KeyboardController::keyboardDidHide", data)

    removeKeyboardWatcher()
  }

  @objc func setupKeyboardWatcher() {
      // TODO: sometimes `will` events can be called multiple times. To avoid double re-creation of listener we are adding this condition (if active link is present, then no need to re-setup a listener)
      if (displayLink != nil) {
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
      print("updateKeyboardFrame")
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
    onEvent("onKeyboardMove", keyboardPosition as NSNumber, keyboardPosition / CGFloat(keyboardHeight) as NSNumber)
  }
}
