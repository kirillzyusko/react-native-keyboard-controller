//
//  UIApplication.swift
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 18/07/2024.
//

import Foundation
import UIKit

public extension UIApplication {
  static func getTopViewController(
    base: UIViewController? = UIApplication.shared.keyWindow?.rootViewController
  ) -> UIViewController? {
    if let nav = base as? UINavigationController {
      return getTopViewController(base: nav.visibleViewController)
    }

    if let tab = base as? UITabBarController, let selected = tab.selectedViewController {
      return getTopViewController(base: selected)
    }

    if let presented = base?.presentedViewController {
      return getTopViewController(base: presented)
    }

    return base
  }
}
