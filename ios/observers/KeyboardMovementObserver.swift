//
//  KeyboardMovementObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 2.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit

class CustomDelegate: NSObject, UITextFieldDelegate {
    private var inputAccessoryView2: UIView?
    
    init(inputAccessoryView: UIView? = nil) {
        self.inputAccessoryView2 = inputAccessoryView
    }
    
    func textFieldShouldEndEditing(_ textField: UITextField) -> Bool {
        print("333333 \(Date.currentTimeStamp)")
        return true
    }
    
    func textFieldDidChangeSelection(_ textField: UITextField) {
        (inputAccessoryView2 as! InvisibleInputAccessoryView).updateHeight(to: 0)
        KeyboardView.find()?.layoutIfNeeded()
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        print("11111 \(Date.currentTimeStamp)")
        // inputAccessoryView2?.removeFromSuperview()

        print(textField.inputAccessoryView)
        //
        // textField.inputAccessoryView = nil
        // textField.reloadInputViews()
        //
        // textField.inputAccessoryView?.frame = CGRect(x: 0, y: 0, width: 0, height: 200)
        // textField.inputAccessoryView?.layoutIfNeeded()
        // textField.inputAccessoryView?.reloadInputViews()
        // textField.inputAccessoryView?.isHidden = true
        // textField.reloadInputViews()
        
        print(textField.inputAccessoryView)
        // Dismiss the keyboard
        /*DispatchQueue.main.asyncAfter(deadline: .now() + 0.008) {
            textField.resignFirstResponder()
        }
        
        return false*/
        
        (inputAccessoryView2 as! InvisibleInputAccessoryView).updateHeight(to: 0)
        inputAccessoryView2?.superview?.layoutIfNeeded()
        // KeyboardView.find()?.layoutIfNeeded()
        
        return true
    }
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        //inputAccessoryView?.removeFromSuperview()
        //textField.inputAccessoryView = nil
        //textField.reloadInputViews()
        
        print("2222 \(Date.currentTimeStamp)")
    }
}



@objc(KeyboardMovementObserver)
public class KeyboardMovementObserver: NSObject {
  // class members
  var onEventHanlder: (NSString, NSNumber, NSNumber, NSNumber, NSNumber) -> Void
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
  private var isMounted = false
  // state variables
  private var keyboardHeight: CGFloat = 0.0
  private var duration = 0
  private var tag: NSNumber = -1
  private var animation: KeyboardAnimation?
  // interactive keyboard
  private var hasKVObserver = false
  private var offset: CGFloat = 0.0
    private var inputAccessoryView: UIView?
    private var del: CustomDelegate?

  @objc public init(
    handler: @escaping (NSString, NSNumber, NSNumber, NSNumber, NSNumber) -> Void,
    onNotify: @escaping (String, Any) -> Void,
    onRequestAnimation: @escaping () -> Void,
    onCancelAnimation: @escaping () -> Void
  ) {
    onEventHanlder = handler
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
        selector: #selector(keyboardWillChangeFrame),
        name: UIResponder.keyboardWillChangeFrameNotification,
        object: nil
      )
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
    print("setupKVObserver")
    if hasKVObserver {
      return
    }

    if keyboardView != nil {
      hasKVObserver = true
      keyboardView?.addObserver(self, forKeyPath: "center", options: .new, context: nil)
    }
  }

  private func removeKVObserver() {
    print("removeKVObserver")
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
      print("AAA kh: \(keyboardHeight) kp: \(keyboardPosition) p: \(position)")

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

    @objc func keyboardWillChangeFrame(_ notification: Notification) {
        guard let keyboardEndFrame = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect else { return }
        
        let keyboardVisibleHeight = UIScreen.main.bounds.height - keyboardEndFrame.origin.y
        print("kwch \(keyboardVisibleHeight) \(Date.currentTimeStamp)")
        /*if keyboardVisibleHeight == 0.0 {
            print("clean - will change frame")
            // clean dark magic
            let input = FocusedInputHolder.shared.get() as? UITextField
            print(input)
            input?.inputAccessoryView = nil
            input?.reloadInputViews()
            input?.layoutIfNeeded()
            _keyboardView?.layoutIfNeeded()
            offset = 0.0
        }*/
    }
    
  @objc func keyboardWillAppear(_ notification: Notification) {
    if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
      tag = UIResponder.current.reactViewTag
        if (UIResponder.current?.inputAccessoryView == nil) {
            
        }
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
        
      print("keyboardWillAppear \(keyboardHeight) \(Date.currentTimeStamp)")
        let b = UIResponder.current?.inputAccessoryView
        /*if let accessoryView = inputAccessoryView {
            let h = Int.random(in: 0..<200)
            print(h)
            (b as? InvisibleInputAccessoryView)?.updateHeight(to: CGFloat(h))
        }*/
        let c = _keyboardView?.superview
        let d = b?.superview
        let e = inputAccessoryView?.superview


      onRequestAnimation()
      onEvent("onKeyboardMoveStart", Float(keyboardHeight) as NSNumber, 1, duration as NSNumber, tag)
      onNotify("KeyboardController::keyboardWillShow", data)

      setupKeyboardWatcher()
      initializeAnimation(fromValue: prevKeyboardPosition, toValue: keyboardHeight)
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
//////////////////
      // clean dark magic
      /*let input = FocusedInputHolder.shared.get() as? UITextField
      input?.inputAccessoryView?.frame = CGRect.init(x: 0, y: 0, width: 0, height: 0)
      input?.inputAccessoryView?.layoutIfNeeded()
      input?.reloadInputViews()
      input?.layoutIfNeeded()
      inputAccessoryView?.removeFromSuperview()*/
      // _keyboardView?.layoutIfNeeded()
      // _keyboardView?.reloadInputViews()
      // input?.inputAccessoryView?.isHidden = true
      offset = 0.0
//////////////////
    onEvent("onKeyboardMoveStart", 0, 0, duration as NSNumber, tag)
    onNotify("KeyboardController::keyboardWillHide", data)
      
    print("keyboardWillDisappear \(keyboardHeight) \(Date.currentTimeStamp)")

    setupKeyboardWatcher()
    removeKVObserver()
    initializeAnimation(fromValue: prevKeyboardPosition, toValue: 0)
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
        
      print("keyboardDidAppear \(keyboardHeight) \(Date.currentTimeStamp)")

      removeKeyboardWatcher()
      setupKVObserver()
      animation = nil
      
      let h = 50.0
      offset = h
        if let activeTextField = UIResponder.current as? UITextField, activeTextField.inputAccessoryView == nil {
            print("ATTACH FAKE ACCESSORY VIEW")
            inputAccessoryView = InvisibleInputAccessoryView()
            activeTextField.translatesAutoresizingMaskIntoConstraints = false
            
            /*NSLayoutConstraint.activate([
                activeTextField.topAnchor.constraint(equalTo: inputAccessoryView!.safeAreaLayoutGuide.topAnchor),
                activeTextField.leftAnchor.constraint(equalTo: inputAccessoryView!.leftAnchor),
                activeTextField.rightAnchor.constraint(equalTo: inputAccessoryView!.rightAnchor),
                activeTextField.bottomAnchor.constraint(equalTo: inputAccessoryView!.safeAreaLayoutGuide.bottomAnchor)
                    ])*/
            
          activeTextField.inputAccessoryView = inputAccessoryView
            inputAccessoryView?.autoresizingMask = .flexibleHeight
          activeTextField.reloadInputViews()
            del = CustomDelegate(inputAccessoryView: inputAccessoryView)
            activeTextField.delegate = del
      }
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
    animation = nil
      
    print("keyboardDidDisappear \(keyboardHeight) \(Date.currentTimeStamp)")
      
    // clean dark magic
    (FocusedInputHolder.shared.get() as? UITextField)?.inputAccessoryView = nil
    offset = 0.0
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
    let positionAnimation = keyboardView?.layer.presentation()?.animation(forKey: "position") as? CASpringAnimation
    guard let keyboardAnimation = positionAnimation else {
      return
    }
    animation = SpringAnimation(animation: keyboardAnimation, fromValue: fromValue, toValue: toValue)
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
      
    print("onMove \(keyboardPosition)")

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
    
    private func onEvent(_ event: NSString, _ position: NSNumber, _ progress: NSNumber, _ duration: NSNumber, _ tag: NSNumber) {
        onEventHanlder(
          event,
          // max((CGFloat(position) - offset), 0) as NSNumber,
          max((CGFloat(position)), 0) as NSNumber,
          progress,
          duration,
          tag
        )
    }
}
