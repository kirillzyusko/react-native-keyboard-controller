//
//  KeyboardControllerConfiguration.swift
//  Pods
//
//  Created by Kiryl Ziusko on 25/06/2026.
//

enum KeyboardControllerConfiguration {
  static var usesKeyboardLayoutGuideTracking: Bool {
    // `KeyboardLayoutGuide` is not stable yet, especially on iOS 26. Several bugs:
    // - KVO on interactive dismissal produces incorrect values on iOS 26.0 (and the fix on iOS 26.0 breaks the behavior on iOS 26.2)
    // - `TimingAnimation` is never picked up properly (after interactive dismissal when keyboard goes up)
    return false
  }
}
