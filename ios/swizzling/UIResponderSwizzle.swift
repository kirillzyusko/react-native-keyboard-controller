//
//  UIResponderSwizzle.swift
//  Pods
//
//  Created by Kiryl Ziusko on 01/11/2024.
//

import Foundation
import UIKit

private var pendingBecomeResponder: TextInput?
private var originalResignFirstResponder: IMP?
private var originalBecomeFirstResponder: IMP?

extension UIApplication {
  var keyboardWindow: UIWindow? {
    // iOS 16+: official-ish private API on UIRemoteKeyboardWindow
    if #available(iOS 16.0, *),
       let cls = NSClassFromString("UIRemoteKeyboardWindow") as? NSObject.Type
    {
      let sel = NSSelectorFromString("remoteKeyboardWindowForScreen:create:")
      let screen = UIScreen.main
      // returns UIWindow? — cast via unmanaged to avoid ARC mis-claim
      let result = cls.perform(sel, with: screen, with: false)
      return UIWindow.topWindow
    }
    // Pre-iOS 16: scan windows by class name suffix
    return UIApplication.shared.windows.first { window in
      let name = NSStringFromClass(type(of: window))
      return name.hasPrefix("UI") && name.hasSuffix("RemoteKeyboardWindow")
    }
  }

  var keyboardView: UIView? {
    guard let kbWindow = keyboardWindow else { return nil }
    // hierarchy: UIRemoteKeyboardWindow > UIInputSetContainerView > UIInputSetHostView
    for container in kbWindow.subviews where
      NSStringFromClass(type(of: container)).hasSuffix("InputSetContainerView")
    {
      for host in container.subviews where
        NSStringFromClass(type(of: host)).hasSuffix("InputSetHostView")
      {
        return host
      }
    }
    return nil
  }
}

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
        }
      } else {
        // If casting to TextInput fails
        return self.callOriginalResignFirstResponder(originalResignSelector)
      }

      KeyboardAreaExtender.shared.hide()

      // Postpone execution of the original resignFirstResponder
      DispatchQueue.main.asyncAfter(deadline: .now() + UIUtils.nextFrame) {
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
    UIView.performWithoutAnimation {
      castOriginalBecomeFirstResponder(self, selector)
    }

    /* DispatchQueue.main.asyncAfter(deadline: .now() + 2.5, execute: {
       KeyboardView.find()?.subviews[0].transform = CGAffineTransform(translationX: 0, y: -150)
       print(KeyboardView.find()?.superview?.superview?.layer.sublayers)
       KeyboardView.find()?.superview?.superview?.transform = CGAffineTransform(translationX: 0, y: -150)
       if let kb = UIApplication.shared.keyboardView {
           kb.layer.bounds = CGRect(origin: CGPoint(x: 0, y: -50), size: kb.bounds.size)
       }
     }) */

    return true
  }
}
