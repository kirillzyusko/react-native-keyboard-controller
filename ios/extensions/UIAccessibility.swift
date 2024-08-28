//
//  UIAccessibility.swift
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 27/08/2024.
//

import Foundation

public extension UIAccessibility {
  static var areCrossFadeTransitionsEnabled: Bool {
    if #available(iOS 14.0, *) {
      return UIAccessibility.prefersCrossFadeTransitions
    } else {
      return false
    }
  }
}
