//
//  UIResponderSwizzle.swift
//  Pods
//
//  Created by Kiryl Ziusko on 01/11/2024.
//

import Foundation
import UIKit

private var pendingBecomeResponder: TextInput?
private weak var pendingResignResponder: UIResponder?
private var originalResignFirstResponder: IMP?
private var originalBecomeFirstResponder: IMP?

@objc
extension UIResponder {
  public static func swizzleBecomeFirstResponder() {
    let originalBecomeSelector = #selector(becomeFirstResponder)
    guard
      let originalBecomeMethod = class_getInstanceMethod(UIResponder.self, originalBecomeSelector)
    else {
      return
    }

    originalBecomeFirstResponder = method_getImplementation(originalBecomeMethod)

    let swizzledBecomeImplementation: @convention(block) (UIResponder) -> Bool = { (self) in
      pendingBecomeResponder = self as? TextInput

      DispatchQueue.main.asyncAfter(deadline: .now() + UIUtils.nextFrame) {
        pendingBecomeResponder = nil
      }

      return self.callOriginalBecomeFirstResponder(originalBecomeSelector)
    }

    let implementation = imp_implementationWithBlock(swizzledBecomeImplementation)
    method_setImplementation(originalBecomeMethod, implementation)
  }

  public static func swizzleResignFirstResponder() {
    let originalResignSelector = #selector(resignFirstResponder)

    guard
      let originalResignMethod = class_getInstanceMethod(UIResponder.self, originalResignSelector)
    else {
      return
    }

    originalResignFirstResponder = method_getImplementation(originalResignMethod)

    let swizzledResignImplementation: @convention(block) (UIResponder) -> Bool = { (self) in
      // Check the type of responder
      if let textField = self as? TextInput {
        // check inputAccessoryView and call original method immediately if not InvisibleInputAccessoryView
        if !(textField.inputAccessoryView is InvisibleInputAccessoryView) {
          return self.callOriginalResignFirstResponder(originalResignSelector)
        } else if pendingBecomeResponder != nil {
          // if we already have a new focus request
          pendingBecomeResponder = nil
          KeyboardAreaExtender.shared.hide()
          (self as? TextInput)?.inputAccessoryView = nil
          KeyboardAreaExtender.shared.remove()
          return self.callOriginalResignFirstResponder(originalResignSelector)
        } else if pendingResignResponder === self {
          // UIKit asks again before the postponed resign has been executed - it happens when
          // input is getting removed from the window (native-stack pop on iOS 26+, unmount, etc.).
          // A frame later input will be detached and resign will fail (window will keep a stale
          // first responder), so we have to resign immediately while input is still attached
          pendingResignResponder = nil
          NotificationCenter.default.post(
            name: .shouldIgnoreKeyboardEvents, object: nil, userInfo: ["ignore": false]
          )
          (self as? TextInput)?.inputAccessoryView = nil
          KeyboardAreaExtender.shared.remove()
          return self.callOriginalResignFirstResponder(originalResignSelector)
        }
      } else {
        // If casting to TextInput fails
        return self.callOriginalResignFirstResponder(originalResignSelector)
      }

      KeyboardAreaExtender.shared.hide()
      pendingResignResponder = self

      // Postpone execution of the original resignFirstResponder
      DispatchQueue.main.asyncAfter(deadline: .now() + UIUtils.nextFrame) {
        if pendingResignResponder === self {
          pendingResignResponder = nil
        }
        NotificationCenter.default.post(
          name: .shouldIgnoreKeyboardEvents, object: nil, userInfo: ["ignore": false]
        )
        (self as? TextInput)?.inputAccessoryView = nil
        KeyboardAreaExtender.shared.remove()
        _ = self.callOriginalResignFirstResponder(originalResignSelector)
      }

      // We need to return a value immediately, even though the actual action is delayed
      return false
    }

    let implementation = imp_implementationWithBlock(swizzledResignImplementation)
    method_setImplementation(originalResignMethod, implementation)
  }

  private func callOriginalResignFirstResponder(_ selector: Selector) -> Bool {
    guard let originalResignFirstResponder = originalResignFirstResponder else { return false }
    typealias Function = @convention(c) (AnyObject, Selector) -> Bool
    let castOriginalResignFirstResponder = unsafeBitCast(
      originalResignFirstResponder, to: Function.self
    )
    return castOriginalResignFirstResponder(self, selector)
  }

  private func callOriginalBecomeFirstResponder(_ selector: Selector) -> Bool {
    guard let originalBecomeFirstResponder = originalBecomeFirstResponder else { return false }
    typealias Function = @convention(c) (AnyObject, Selector) -> Bool
    let castOriginalBecomeFirstResponder = unsafeBitCast(
      originalBecomeFirstResponder, to: Function.self
    )
    return castOriginalBecomeFirstResponder(self, selector)
  }
}
