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
  private weak static var _currentFirstResponder: UIResponder?

  static var current: UIResponder? {
    UIResponder._currentFirstResponder = nil
    UIApplication.shared.sendAction(#selector(findFirstResponder(sender:)), to: nil, from: nil, for: nil)
    return UIResponder._currentFirstResponder
  }

  internal func findFirstResponder(sender _: AnyObject) {
    UIResponder._currentFirstResponder = self
  }
}

public extension Optional where Wrapped == UIResponder {
  var reactViewTag: NSNumber {
    guard let this = self as? UIView else {
      return -1
    }

    let tagExtractor: (UIView) -> NSNumber? = { view in
      #if KEYBOARD_CONTROLLER_NEW_ARCH_ENABLED
        return (view.tag != 0) ? NSNumber(value: view.tag) : nil
      #else
        return view.reactTag
      #endif
    }

    return climbSuperviewChain(startingFrom: this, using: tagExtractor) ?? -1
  }

  var nativeID: String? {
    guard let superview = (self as? UIView)?.superview else { return nil }

    #if KEYBOARD_CONTROLLER_NEW_ARCH_ENABLED
      return (superview as NSObject).value(forKey: "nativeId") as? String
    #else
      return superview.nativeID
    #endif
  }

  private func climbSuperviewChain(startingFrom start: UIView, using tagExtractor: (UIView) -> NSNumber?) -> NSNumber? {
    var currentView: UIView? = start

    while let view = currentView {
      let type = String(describing: type(of: view))

      if type == "RCTRootView" {
        return nil
      }

      if let extractedTag = tagExtractor(view) {
        return extractedTag
      }

      currentView = view.superview
    }

    return nil
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
