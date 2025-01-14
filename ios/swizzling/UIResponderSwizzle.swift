//
//  UIResponderSwizzle.swift
//  Pods
//
//  Created by Kiryl Ziusko on 01/11/2024.
//

import Foundation
import UIKit

private var originalResignFirstResponder: IMP?

@objc
extension UIResponder {
  public static func swizzleResignFirstResponder() {
    let originalSelector = #selector(resignFirstResponder)

    guard let originalMethod = class_getInstanceMethod(UIResponder.self, originalSelector) else {
      return
    }

    originalResignFirstResponder = method_getImplementation(originalMethod)

    let swizzledImplementation: @convention(block) (UIResponder) -> Bool = { (self) in
      // Check the type of responder
      if let textField = self as? TextInput {
        // check inputAccessoryView and call original method immediately if not InvisibleInputAccessoryView
        if !(textField.inputAccessoryView is InvisibleInputAccessoryView) {
          return self.callOriginalResignFirstResponder(originalSelector)
        }
      } else {
        // If casting to TextInput fails
        return self.callOriginalResignFirstResponder(originalSelector)
      }

      KeyboardAreaExtender.shared.hide()

      // Postpone execution of the original resignFirstResponder
      DispatchQueue.main.asyncAfter(deadline: .now() + UIUtils.nextFrame) {
        (self as? TextInput)?.inputAccessoryView = nil
        KeyboardAreaExtender.shared.remove()
        _ = self.callOriginalResignFirstResponder(originalSelector)
      }

      // We need to return a value immediately, even though the actual action is delayed
      return false
    }

    let implementation = imp_implementationWithBlock(swizzledImplementation)
    method_setImplementation(originalMethod, implementation)
  }

  private func callOriginalResignFirstResponder(_ selector: Selector) -> Bool {
    guard let originalResignFirstResponder = originalResignFirstResponder else { return false }
    typealias Function = @convention(c) (AnyObject, Selector) -> Bool
    let castOriginalResignFirstResponder = unsafeBitCast(originalResignFirstResponder, to: Function.self)
    let result = castOriginalResignFirstResponder(self, selector)
    return result
  }
}
