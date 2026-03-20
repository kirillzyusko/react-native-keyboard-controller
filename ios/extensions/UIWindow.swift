//
//  UIWindow.swift
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 12/09/2024.
//

import Foundation
import ObjectiveC
import UIKit

@objc
public extension UIWindow {
  static let sharedKeyboardWindowObserver = KeyboardWindowObserver()

  class KeyboardWindowObserver: NSObject {
    private weak var keyboardWindow: UIWindow?

    override init() {
      super.init()
      NotificationCenter.default.addObserver(
        self,
        selector: #selector(windowDidBecomeVisible(_:)),
        name: UIWindow.didBecomeVisibleNotification,
        object: nil
      )
    }

    @objc private func windowDidBecomeVisible(_ notification: Notification) {
      guard let window = notification.object as? UIWindow else { return }

      // Check if the window is of UIRemoteKeyboardWindow class
      let type = String(describing: window)
      if type.range(of: "UIRemoteKeyboardWindow") != nil {
        keyboardWindow = window
      }
    }

    func getTopWindow() -> UIWindow? {
      let keyboardView = KeyboardView.find()
      // return the keyboard window if it's available and keyboard is visible, otherwise return the last window
      return (keyboardWindow != nil && keyboardView.isVisibleInHierarchy())
        ? keyboardWindow
        : UIApplication.shared.activeWindow
    }
  }

  static var topWindow: UIWindow? {
    return sharedKeyboardWindowObserver.getTopWindow()
  }
}
