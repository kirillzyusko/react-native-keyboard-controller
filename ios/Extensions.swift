//
//  Extensions.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 10/06/2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import UIKit

public extension CGFloat {
  static func interpolate(inputRange: [CGFloat], outputRange: [CGFloat], currentValue: CGFloat) -> CGFloat {
    let inputMin = inputRange.min() ?? 0
    let inputMax = inputRange.max() ?? 1
    let outputMin = outputRange.min() ?? 0
    let outputMax = outputRange.max() ?? 1

    let normalizedValue = (currentValue - inputMin) / (inputMax - inputMin)
    let interpolatedValue = outputMin + (outputMax - outputMin) * normalizedValue

    return interpolatedValue
  }
}

public extension Date {
  static var currentTimeStamp: Int64 {
    return Int64(Date().timeIntervalSince1970 * 1000)
  }
}

public extension UIResponder {
  private weak static var _currentFirstResponder: UIResponder?

  static var current: UIResponder? {
    UIResponder._currentFirstResponder = nil
    UIApplication.shared.sendAction(#selector(findFirstResponder(sender:)), to: nil, from: nil, for: nil)
    return UIResponder._currentFirstResponder
  }

  @objc internal func findFirstResponder(sender _: AnyObject) {
    UIResponder._currentFirstResponder = self
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

public extension UIView {
  var globalFrame: CGRect? {
    let rootView = UIApplication.shared.keyWindow?.rootViewController?.view
    return superview?.convert(frame, to: rootView)
  }
}
