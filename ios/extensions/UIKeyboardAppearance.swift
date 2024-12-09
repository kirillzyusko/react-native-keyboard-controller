//
//  UIKeyboardAppearance.swift
//  Pods
//
//  Created by Kiryl Ziusko on 08/12/2024.
//

import Foundation
import UIKit

public extension UIKeyboardAppearance {
  var name: String {
    switch self {
    case .default: return "default"
    case .dark: return "dark"
    case .light: return "light"
    @unknown default:
      return "default"
    }
  }
}
