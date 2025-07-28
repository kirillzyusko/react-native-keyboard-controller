//
//  KeyboardTrackingView.swift
//  Pods
//
//  Created by Kiryl Ziusko on 25/07/2025.
//

import UIKit

final class KeyboardTrackingView: UIView {
  private var keyboardVisibleHeight: CGFloat = 0

  override init(frame: CGRect) {
    super.init(frame: frame)
    setup()
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
    setup()
  }

  required init() {
    super.init(frame: .zero)
    setup()
  }

  deinit {
    NotificationCenter.default.removeObserver(self)
  }

  private func setup() {
    isUserInteractionEnabled = false
    isHidden = true
    frame = CGRect(x: 0, y: -1, width: 0, height: 0)

    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardWillChangeFrame(_:)),
      name: UIResponder.keyboardWillChangeFrameNotification,
      object: nil
    )

    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardDidHide(_:)),
      name: UIResponder.keyboardDidHideNotification,
      object: nil
    )

    guard let window = UIApplication.shared.activeWindow else {
      return
    }
    window.addSubview(self)
  }

  @objc private func keyboardWillChangeFrame(_ notification: Notification) {
    guard let userInfo = notification.userInfo,
          let endFrame = userInfo[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect,
          let window = window
    else {
      return
    }

    let convertedEndFrame = window.convert(endFrame, from: nil)
    // Handle both cross-fade (empty) and normal hide (offscreen)
    let isKeyboardHiding = convertedEndFrame.isEmpty || convertedEndFrame.minY >= window.bounds.height

    let keyboardHeight: CGFloat = isKeyboardHiding ? 0 : max(0, window.bounds.height - convertedEndFrame.minY)

    // TODO: fix keyboard show after interactive gesture
    // TODO: change translateY to optimize performance
    self.frame = CGRect(x: 0, y: -1, width: 0, height: keyboardHeight)

    keyboardVisibleHeight = keyboardHeight
  }

  @objc private func keyboardDidHide(_: Notification) {
    // Reset
    keyboardVisibleHeight = 0
    frame.size.height = 0
  }

  func currentHeight() -> CGFloat {
    return keyboardVisibleHeight
  }
}
