//
//  KeyboardTrackingView.swift
//  Pods
//
//  Created by Kiryl Ziusko on 25/07/2025.
//

import UIKit

/**
 * A compatibility view that resolves to `KeyboardView` on iOS < 26
 * and uses `keyboardLayoutGuide` on iOS 26+.
 */
final class KeyboardTrackingView: UIView {
  private var keyboardView: UIView? { KeyboardViewLocator.shared.resolve() }
  private var keyboardHeight = 0.0

  static let invalidPosition: CGFloat = -.greatestFiniteMagnitude

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
    // for debug purposes
    // self.backgroundColor = .red
    isUserInteractionEnabled = false
    isHidden = true

    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardWillAppear),
      name: UIResponder.keyboardWillShowNotification,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardDidAppear),
      name: UIResponder.keyboardDidShowNotification,
      object: nil
    )

    guard
      let window = UIApplication.shared.activeWindow,
      let rootView = window.rootViewController?.view
    else {
      return
    }

    rootView.addSubview(self)

    translatesAutoresizingMaskIntoConstraints = false

    if #available(iOS 15.0, *) {
      if #available(iOS 17.0, *) {
        rootView.keyboardLayoutGuide.usesBottomSafeArea = false
      }

      NSLayoutConstraint.activate([
        leadingAnchor.constraint(equalTo: rootView.leadingAnchor, constant: 0),
        trailingAnchor.constraint(equalTo: rootView.trailingAnchor, constant: 0),
        bottomAnchor.constraint(equalTo: rootView.keyboardLayoutGuide.topAnchor, constant: 0),
        heightAnchor.constraint(equalToConstant: 0),
      ])
    }
  }

  @objc private func keyboardWillAppear(_ notification: Notification) {
    updateHeightFromNotification(notification)
  }

  @objc private func keyboardDidAppear(_ notification: Notification) {
    updateHeightFromNotification(notification)
  }

  private func updateHeightFromNotification(_ notification: Notification) {
    let (_, frame) = notification.keyboardMetaData()
    if let keyboardFrame = frame {
      let keyboardHeight = keyboardFrame.cgRectValue.size.height
      self.keyboardHeight = keyboardHeight
    }
  }

  @objc var view: UIView? {
    if #available(iOS 26.0, *) {
      return self
    } else {
      return keyboardView
    }
  }

  func interactive(point: CGPoint) -> CGFloat {
    guard let trackedView = view else { return Self.invalidPosition }

    let keyboardFrameY = point.y
    let keyboardWindowH = trackedView.window?.bounds.size.height ?? 0
    let keyboardPosition = keyboardWindowH - keyboardFrameY

    // for `keyboardLayoutGuide` case we can just read keyboard position directly - no interpolation needed
    if #available(iOS 26.0, *) {
      // when we are the top position KVO takes `inputAccessoryView` into consideration,
      // so we handle it here
      if keyboardPosition == keyboardHeight {
        return keyboardPosition - KeyboardAreaExtender.shared.offset
      }
      return keyboardPosition
    }

    // if keyboard height is not equal to its bounds - we can ignore
    // values, since they'll be invalid and will cause UI jumps
    // valid only for non-`keyboardLayoutGuide` case
    if floor(trackedView.bounds.size.height) != floor(keyboardHeight) {
      return Self.invalidPosition
    }

    let position = CGFloat.interpolate(
      inputRange: [keyboardHeight / 2, -keyboardHeight / 2],
      outputRange: [keyboardHeight, 0],
      currentValue: keyboardPosition
    )

    return position - KeyboardAreaExtender.shared.offset
  }
}
