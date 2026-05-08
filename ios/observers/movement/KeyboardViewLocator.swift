//
//  KeyboardViewLocator.swift
//  Pods
//
//  Created by Kiryl Ziusko on 25/07/2025.
//

final class KeyboardViewLocator {
  static let shared = KeyboardViewLocator()
  private weak var cachedKeyboardView: UIView?
  private var cachedWindowsCount: Int = 0

  func resolve() -> UIView? {
    // on iOS 26 we always get a new keyboard istance
    if #available(iOS 26, *) {
      return KeyboardView.find()
    }

    let currentWindowsCount = UIApplication.shared.windows.count
    
    if cachedKeyboardView == nil || currentWindowsCount != cachedWindowsCount {
      cachedKeyboardView = KeyboardView.find()
      cachedWindowsCount = currentWindowsCount
    }

    return cachedKeyboardView
  }
}
