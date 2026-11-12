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
  private static let windowPrefix = ["<UITextEffectsWindow", "<UIRemoteKeyboardWindow"]
  private static let containerPrefixes = ["<UIInputSetContainerView", "<UITrackingWindowView"]
  private static let hostPrefixes = ["<UIInputSetHostView", "<UIKeyboardItemContainerView"]
  /// inspired by https://stackoverflow.com/questions/32598490/show-uiview-with-buttons-over-keyboard-like-in-skype-viber-messengers-swift-i
  static func find() -> UIView? {
    var windows: [UIWindow?] = []

    if #available(iOS 26.0, *) {
      windows = [UIWindow.keyboardWindow]
    } else {
      windows = UIApplication.shared.windows
    }

    for window in windows {
      guard let window = window else { continue }

      if window.description.hasAnyPrefix(windowPrefix) {
        for subview in window.subviews {
          if subview.description.hasAnyPrefix(containerPrefixes) {
            for hostView in subview.subviews {
              if hostView.description.hasAnyPrefix(hostPrefixes), hostView.frame.height != 0 {
                return hostView
              }
            }
            break
          }
        }
      }
    }

    return nil
  }
}
