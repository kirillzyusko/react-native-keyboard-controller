//
//  KeyboardTrackingView.swift
//  Pods
//
//  Created by Kiryl Ziusko on 25/07/2025.
//

import UIKit

// TODO: cross fade transitions
// TODO: fix keyboard show after interactive gesture
// TODO: change translateY to optimize performance
// TODO: test Modal
/**
 * A compatibility view that resolves to `KeyboardView` on iOS < 26
 * and uses `keyboardLayoutGuide` on iOS 26+.
 */
final class KeyboardTrackingView: UIView {
  private var keyboardView: UIView? { KeyboardViewLocator.shared.resolve() }

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

  private func setup() {
    // for debug purposes
    // self.backgroundColor = .red
    isUserInteractionEnabled = false
    isHidden = true

    guard
      let window = UIApplication.shared.activeWindow,
      let rootView = window.rootViewController?.view
    else {
      return
    }

    rootView.addSubview(self)

    translatesAutoresizingMaskIntoConstraints = false

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

  @objc var view: UIView? {
    if #available(iOS 26.0, *) {
      return self
    } else {
      return keyboardView
    }
  }
}
