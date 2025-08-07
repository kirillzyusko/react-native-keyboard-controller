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
  private var keyboardTrackingView = KeyboardTrackingView()

  private var prevKeyboardPosition = 0.0
  private var displayLink: CADisplayLink!
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

    super.init()

    displayLink = CADisplayLink(target: self, selector: #selector(updateKeyboardFrame))
    displayLink.preferredFramesPerSecond = 120 // will fallback to 60 fps for devices without Pro Motion display
    displayLink.add(to: .main, forMode: .common)
    displayLink.isPaused = true
  }

  deinit {
    displayLink.invalidate()
    displayLink = nil
    NotificationCenter.default.removeObserver(self)
  }
}
