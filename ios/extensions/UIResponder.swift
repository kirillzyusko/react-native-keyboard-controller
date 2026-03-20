//
//  UIResponder.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 04/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation
import UIKit

@objc
public extension UIResponder {
  static var current: UIResponder? {
    guard let window = UIApplication.shared.activeWindow else { return nil }
    return window.findFirstResponder()
  }
}

public extension Optional where Wrapped == UIResponder {
  var reactViewTag: NSNumber {
    #if KEYBOARD_CONTROLLER_NEW_ARCH_ENABLED
      return ((self as? UIView)?.superview?.tag ?? -1) as NSNumber
    #else
      return (self as? UIView)?.superview?.reactTag ?? -1
    #endif
  }

  var nativeID: String? {
    guard let superview = (self as? UIView)?.superview else { return nil }

    #if KEYBOARD_CONTROLLER_NEW_ARCH_ENABLED
      return superview.safeValue(forKey: "nativeId") as? String
    #else
      return superview.nativeID
    #endif
  }
}

public extension Optional where Wrapped: UIResponder {
  var parentScrollViewTarget: NSNumber {
    var currentResponder: UIResponder? = self

    while let currentView = currentResponder {
      // If the current responder is a vertical, scrollable UIScrollView (excluding UITextView), return its tag
      if let scrollView = currentView as? UIScrollView,
         !(currentView is UITextView),
         scrollView.frame.width >= scrollView.contentSize.width,
         scrollView.isScrollEnabled
      {
        return scrollView.reactViewTag
      }

      // Move to the next responder in the chain
      currentResponder = currentView.next
    }

    // UIScrollView is not found
    return -1
  }
}

@objc
public extension UIResponder {
  private static var hasPreloadedKeyboard = false
  static var isKeyboardPreloading = false

  /// Preloads the keyboard UI to reduce first-time lag when showing a keyboard.
  /// https://stackoverflow.com/questions/9357026/super-slow-lag-delay-on-initial-keyboard-animation-of-uitextfield/20436797#20436797
  static func preloadKeyboardIfNeeded() {
    guard !hasPreloadedKeyboard else { return }
    hasPreloadedKeyboard = true
    isKeyboardPreloading = true

    DispatchQueue.main.async {
      defer { isKeyboardPreloading = false }
      guard let window = UIApplication.shared.activeWindow else { return }

      let lagFreeField = UITextField(frame: .zero)
      lagFreeField.isHidden = true
      window.addSubview(lagFreeField)

      lagFreeField.becomeFirstResponder()
      lagFreeField.resignFirstResponder()
      lagFreeField.removeFromSuperview()
    }
  }
}
