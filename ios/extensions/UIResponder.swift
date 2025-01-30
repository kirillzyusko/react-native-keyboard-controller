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
      if superview.responds(to: Selector(("nativeId"))) == true {
        return (superview as NSObject).value(forKey: "nativeId") as? String
      }

      return nil
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
