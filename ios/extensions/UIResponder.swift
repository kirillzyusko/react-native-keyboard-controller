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
    let type = String(describing: type(of: self))
    // handle `contextMenuHidden` prop - in this case the parent is considered as a first responder
    // (but actually its children is an actual input), so we apply correction here and point out
    // to the actual first responder (first children)
    let isChildrenActuallyFirstResponder =
      type == "RCTMultilineTextInputView" ||
      type == "RCTSinglelineTextInputView" ||
      type == "RCTTextInputComponentView"
    if isChildrenActuallyFirstResponder {
      UIResponder._currentFirstResponder = (self as? UIView)?.subviews[0]
    } else {
      UIResponder._currentFirstResponder = self
    }
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
