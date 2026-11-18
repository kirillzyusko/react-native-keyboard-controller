//
//  UINavigationController.swift
//  Pods
//
//  Created by Kiryl Ziusko on 18/11/2026.
//

extension UINavigationController {
  /// System gestures that pop a screen.
  var swipeBackGestureRecognizers: [UIGestureRecognizer] {
    return [
      interactivePopGestureRecognizer,
      // full screen gesture, available since iOS 26
      value(forKeyIfExists: "interactiveContentPopGestureRecognizer") as? UIGestureRecognizer,
    ].compactMap { $0 }
  }
}
