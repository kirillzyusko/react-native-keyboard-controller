//
//  KeyboardMovementObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 2.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit

// kindly taken from https://stackoverflow.com/a/35189336

protocol CAProgressLayerDelegate: CALayerDelegate {
    func progressDidChange(to progress: CGFloat)
}

extension CAProgressLayerDelegate {
    func progressDidChange(to progress: CGFloat) {}
}

class CAProgressLayer: CALayer {
    private struct Const {
        static let animationKey: String = "progress"
    }

    @NSManaged private(set) var progress: CGFloat
    private var previousProgress: CGFloat?
    private var progressDelegate: CAProgressLayerDelegate? { return self.delegate as? CAProgressLayerDelegate }

    override init() {
        super.init()
    }

    init(frame: CGRect) {
        super.init()
        self.frame = frame
    }

    override init(layer: Any) {
        super.init(layer: layer)
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        self.progress = CGFloat(aDecoder.decodeFloat(forKey: Const.animationKey))
    }

    override func encode(with aCoder: NSCoder) {
        super.encode(with: aCoder)
        aCoder.encode(Float(self.progress), forKey: Const.animationKey)
    }

    override class func needsDisplay(forKey key: String) -> Bool {
        if key == Const.animationKey { return true }
        return super.needsDisplay(forKey: key)
    }

    override func display() {
        super.display()
        guard let layer: CAProgressLayer = self.presentation() else { return }
        self.progress = layer.progress
        if self.progress != self.previousProgress {
            self.progressDelegate?.progressDidChange(to: self.progress)
        }
        self.previousProgress = self.progress
    }
}

class ProgressView: UIView {
    override class var layerClass: AnyClass {
        return CAProgressLayer.self
    }
}
var i = 0
@objc(KeyboardMovementObserver)
public class KeyboardMovementObserver: NSObject, CAProgressLayerDelegate {
  // class members
  var onEvent: (NSString, NSNumber, NSNumber, NSNumber, NSNumber) -> Void
  var onNotify: (String, Any) -> Void
    private var view: UIView?
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
  private var hasKVObserver = false
  private var isMounted = false
  // state variables
  private var keyboardHeight: CGFloat = 0.0
  private var duration = 0
  private var tag: NSNumber = -1
    // text views
    let currentProgress = UITextView()
    let currentProgressCommitTime = UITextView()
    let currentDisplayLink = UITextView()
    let currentDisplayLinkCommitTime = UITextView()
    let syncCircle = UIView()

  @objc public init(
    handler: @escaping (NSString, NSNumber, NSNumber, NSNumber, NSNumber) -> Void,
    onNotify: @escaping (String, Any) -> Void,
    view: UIView
  ) {
    onEvent = handler
    self.onNotify = onNotify
      self.view = view
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
    
    func progressDidChange(to progress: CGFloat) {
        print(progress)
        onEvent("onKeyboardMove", keyboardHeight * progress as NSNumber, progress as NSNumber, -1, tag)
        currentProgress.text = "Progress: \(keyboardHeight * progress)"
        currentProgressCommitTime.text = "Progress commit time: \(CACurrentMediaTime())"
        let size = 50
        let screenSize: CGRect = UIScreen.main.bounds
        let y = screenSize.height - CGFloat(size) - keyboardHeight * progress
        syncCircle.frame = CGRect(x: 40, y: y, width: 50, height: 50)
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

      onEvent("onKeyboardMoveStart", Float(keyboardHeight) as NSNumber, 1, duration as NSNumber, tag)
      onNotify("KeyboardController::keyboardWillShow", data)
        let a = keyboardView?.layer.animation(forKey: "position")
        print(a)
        var animations = [CAAnimation]()

                let progressAnimation = CASpringAnimation(keyPath: "progress")
        
        progressAnimation.fromValue = ((i % 2) != 0) ? 1 : 0
                                progressAnimation.toValue = ((i % 2) != 0) ? 0 : 1
                                progressAnimation.duration = 0.5
                                progressAnimation.damping = 500
                                progressAnimation.stiffness = 1000
                                progressAnimation.mass = 3
                                animations.append(progressAnimation)
        i += 1
                let newSublayer = CALayer()
                let screenSize: CGRect = UIScreen.main.bounds
                            let size = 50.0
                newSublayer.frame = CGRect(x: 20, y: screenSize.height - size, width: size, height: size)
                newSublayer.cornerRadius = size / 2
                newSublayer.backgroundColor = UIColor.green.cgColor
                self.view?.layer.addSublayer(newSublayer)
                let progressView = ProgressView(frame: newSublayer.frame)
                                progressView.layer.delegate = self
                self.view?.addSubview(progressView)

                CATransaction.begin()
                        progressView.layer.add(progressAnimation, forKey: nil)
                        CATransaction.commit()
        
        currentProgress.frame = CGRect(x: 20, y: 100, width: 200, height: 50)
        currentProgress.text = ""
        currentProgress.font = UIFont.systemFont(ofSize: 16)
        self.view?.addSubview(currentProgress)
        currentProgressCommitTime.frame = CGRect(x: 20, y: 150, width: 200, height: 50)
        currentProgressCommitTime.text = ""
        currentProgressCommitTime.font = UIFont.systemFont(ofSize: 16)
        self.view?.addSubview(currentProgressCommitTime)
        currentDisplayLink.frame = CGRect(x: 20, y: 200, width: 200, height: 50)
        currentDisplayLink.text = "DL"
        currentDisplayLink.font = UIFont.systemFont(ofSize: 16)
        self.view?.addSubview(currentDisplayLink)
        currentDisplayLinkCommitTime.frame = CGRect(x: 20, y: 250, width: 200, height: 50)
        currentDisplayLinkCommitTime.text = "DLCT"
        currentDisplayLinkCommitTime.font = UIFont.systemFont(ofSize: 16)
        self.view?.addSubview(currentDisplayLinkCommitTime)
        syncCircle.frame = CGRect(x: 40, y: screenSize.height - size, width: size, height: size)
        syncCircle.backgroundColor = .green
        syncCircle.layer.cornerRadius = 25
        self.view?.addSubview(syncCircle)

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
                result = hostView
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

    let keyboardFrameY = keyboardView?.layer.presentation()?.frame.origin.y ?? 0
    let keyboardWindowH = keyboardView?.window?.bounds.size.height ?? 0
    let keyboardPosition = keyboardWindowH - keyboardFrameY

    if keyboardPosition == prevKeyboardPosition || keyboardFrameY == 0 {
      return
    }

    prevKeyboardPosition = keyboardPosition
    /*onEvent(
      "onKeyboardMove",
      keyboardPosition as NSNumber,
      keyboardPosition / CGFloat(keyboardHeight) as NSNumber,
      duration as NSNumber,
      tag
    )*/
      
      currentDisplayLink.text = "DisplayLink: \(keyboardPosition)"
      currentDisplayLinkCommitTime.text = "DisplayLink commit time: \(CACurrentMediaTime())"
  }
}
