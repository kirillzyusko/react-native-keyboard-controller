//
//  UIResponder.swift
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
      // Add your custom behavior here
      print("Performing custom actions before the original resignFirstResponder")

      if let textField = self as? TextInput {
        (textField.inputAccessoryView as? InvisibleInputAccessoryView)?.updateHeight(to: 0)
        textField.inputAccessoryView?.superview?.layoutIfNeeded()
      }

      // Postpone execution of the original resignFirstResponder
      DispatchQueue.main.asyncAfter(deadline: .now() + UIUtils.nextFrame) {
        // Call the original resignFirstResponder
        typealias Function = @convention(c) (AnyObject, Selector) -> Bool
        let castOriginalResignFirstResponder = unsafeBitCast(
          originalResignFirstResponder, to: Function.self)
        _ = castOriginalResignFirstResponder(self, originalSelector)
      }

      return true  // We need to return a value immediately, even though the actual action is delayed
    }

    let implementation = imp_implementationWithBlock(swizzledImplementation)
    method_setImplementation(originalMethod, implementation)
  }
}
