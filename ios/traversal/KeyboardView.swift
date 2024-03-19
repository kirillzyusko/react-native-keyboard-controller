//
//  KeyboardView.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 19/03/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation
import UIKit

enum KeyboardView {
  // https://stackoverflow.com/questions/32598490/show-uiview-with-buttons-over-keyboard-like-in-skype-viber-messengers-swift-i
  static func find() -> UIView? {
    var result: UIView?

    let windows = UIApplication.shared.windows
    for window in windows {
      if window.description.hasPrefix("<UITextEffectsWindow") {
        for subview in window.subviews {
          if subview.description.hasPrefix("<UIInputSetContainerView") {
            for hostView in subview.subviews {
              if hostView.description.hasPrefix("<UIInputSetHostView") {
                result = hostView
                break
              }
            }
            break
          }
        }
        break
      }
    }
    return result
  }
}
