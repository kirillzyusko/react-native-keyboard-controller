//
//  UIView.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 04/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation
import UIKit

public extension UIView {
  var globalFrame: CGRect? {
    let rootView = UIApplication.shared.activeWindow?.rootViewController?.view
    return superview?.convert(frame, to: rootView)
  }

  func isVisibleInHierarchy(initial: Bool = true) -> Bool {
    guard let window = window else {
      return false
    }
    if isHidden || alpha == 0.0 {
      return false
    }
    if superview === window {
      return true
    } else if let superview = superview {
      if initial, frame.minY >= superview.frame.height {
        return false
      } else {
        return superview.isVisibleInHierarchy(initial: false)
      }
    } else {
      return false
    }
  }

  func findFirstResponder() -> UIView? {
    if isFirstResponder {
      return self
    }
    for subview in subviews {
      if let responder = subview.findFirstResponder() {
        return responder
      }
    }
    return nil
  }
}

public extension Optional where Wrapped == UIView {
  var frameTransitionInWindow: (Double, Double) {
    let areCrossFadeTransitionsEnabled = (self?.layer.presentation()?.animationKeys() ?? []).contains("opacity")
    let frameY = self?.layer.presentation()?.frame.origin.y ?? 0
    let windowH = self?.window?.bounds.size.height ?? 0
    var position = windowH - frameY

    // when cross fade transitions enabled, then keyboard changes
    // its `opacity` instead of `translateY`, so we handle it here
    if areCrossFadeTransitionsEnabled {
      let opacity = self?.layer.presentation()?.opacity ?? 0
      position = CGFloat(opacity) * position
    }

    return (position, frameY)
  }

  func isVisibleInHierarchy(initial: Bool = true) -> Bool {
    guard let view = self else {
      return false
    }
    return view.isVisibleInHierarchy(initial: initial)
  }
}
