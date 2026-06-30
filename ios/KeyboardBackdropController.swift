//
//  KeyboardBackdropController.swift
//  Pods
//
//  Created by Kiryl Ziusko on 29/06/2026.
//

import Foundation
import UIKit

final class KeyboardBackdropController: NSObject {
  static let shared = KeyboardBackdropController()

  private var isTranslucent = false
  private var originalAlphas: [ObjectIdentifier: CGFloat] = [:]

  override init() {
    super.init()

    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardWillShow(_:)),
      name: UIResponder.keyboardWillShowNotification,
      object: nil
    )
  }

  func setTranslucent(_ translucent: Bool) {
    isTranslucent = translucent
    applyTranslucency()
  }

  @objc private func keyboardWillShow(_ notification: Notification) {
    guard isTranslucent, let window = UIWindow.keyboardWindow else {
      return
    }

    applyTranslucency(in: window)
  }

  private func applyTranslucency() {
    guard let keyboardWindow = UIWindow.keyboardWindow else {
      if !isTranslucent {
        originalAlphas.removeAll()
      }
      return
    }

    applyTranslucency(in: keyboardWindow)

    if !isTranslucent {
      originalAlphas.removeAll()
    }
  }

  private func applyTranslucency(in view: UIView) {
    if isKeyboardBackdropView(view) {
      let identifier = ObjectIdentifier(view)

      if isTranslucent {
        if originalAlphas[identifier] == nil {
          originalAlphas[identifier] = view.alpha
        }
        view.alpha = 0
      } else {
        view.alpha = originalAlphas[identifier] ?? 1
      }
    }

    for subview in view.subviews {
      print(view.subviews)
      applyTranslucency(in: subview)
    }
  }

  private func isKeyboardBackdropView(_ view: UIView) -> Bool {
    let type = NSStringFromClass(type(of: view))

    return type.hasSuffix("UIKBBackdropView")
  }
}
