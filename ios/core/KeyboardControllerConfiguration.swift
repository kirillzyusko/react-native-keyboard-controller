//
//  KeyboardControllerConfiguration.swift
//  Pods
//
//  Created by Kiryl Ziusko on 25/06/2026.
//

enum KeyboardControllerConfiguration {
  static var usesKeyboardLayoutGuideTracking: Bool {
    if #available(iOS 26.0, *) {
      return true
    }

    return false
  }
}
