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

  /// Gestures that pop a screen with a custom transition: a navigation library (i. e. `react-native-screens`)
  /// attaches them to the container of the navigation controller and handles them by the same delegate.
  var customSwipeBackGestureRecognizers: [UIGestureRecognizer] {
    guard let delegate = interactivePopGestureRecognizer?.delegate else { return [] }

    return view.superview?.gestureRecognizers?.filter { $0 is UIPanGestureRecognizer && $0.delegate === delegate } ?? []
  }
}
