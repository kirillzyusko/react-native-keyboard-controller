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
    #if targetEnvironment(macCatalyst)
    // On Mac Catalyst running in the Mac idiom, `view.subviews` can contain
    // host containers (e.g. UIRemoteView wrappers around Mac-side AppKit
    // views) whose pointers cannot be bridged to UIView at the Swift level.
    // Iterating them with the standard `for subview in subviews` loop trips
    // a `swift_dynamicCast` SIGSEGV whenever findFirstResponder() is called
    // during normal UIKit operations such as -becomeFirstResponder.
    // Route through UIKit's responder chain via sendAction(_:to: nil, …)
    // instead, which locates the first responder without touching the
    // subview tree.
    if UIDevice.current.userInterfaceIdiom == .mac {
      UIResponder._kbcCapturedFirstResponder = nil
      UIApplication.shared.sendAction(
        #selector(UIResponder._kbcRecordFirstResponder(_:)),
        to: nil,
        from: nil,
        for: nil
      )
      return UIResponder._kbcCapturedFirstResponder as? UIView
    }
    #endif
    for subview in subviews {
      if let responder = subview.findFirstResponder() {
        return responder
      }
    }
    return nil
  }
}

#if targetEnvironment(macCatalyst)
private var _kbcCapturedFirstResponderKey: UInt8 = 0

extension UIResponder {
  fileprivate static var _kbcCapturedFirstResponder: UIResponder? {
    get { objc_getAssociatedObject(UIResponder.self, &_kbcCapturedFirstResponderKey) as? UIResponder }
    set { objc_setAssociatedObject(UIResponder.self, &_kbcCapturedFirstResponderKey, newValue, .OBJC_ASSOCIATION_RETAIN_NONATOMIC) }
  }

  @objc fileprivate func _kbcRecordFirstResponder(_ sender: Any?) {
    UIResponder._kbcCapturedFirstResponder = self
  }
}
#endif

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
