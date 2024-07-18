//
//  UIApplication.swift
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 18/07/2024.
//

import Foundation
import UIKit

public extension UIApplication {
  static func topViewController(
    base: UIViewController? = UIApplication.shared.keyWindow?.rootViewController
  ) -> UIViewController? {
    if let nav = base as? UINavigationController {
      return topViewController(base: nav.visibleViewController)
    }

    if let tab = base as? UITabBarController, let selected = tab.selectedViewController {
      return topViewController(base: selected)
    }

    if let presented = base?.presentedViewController, !presented.isBeingDismissed {
      return topViewController(base: presented)
    }

    return base
  }
}
