//
//  KeyboardExtenderContainerView.swift
//  Pods
//
//  Created by Kiryl Ziusko on 11/07/2025.
//

import UIKit

@objc
public class KeyboardExtenderContainerView: UIView {
  private var visualEffectView: UIVisualEffectView?

  @objc public static func create(frame: CGRect, contentView: UIView) -> UIView {
    #if compiler(>=6.0)
      if #available(iOS 26.0, *) {
        let padding = 20.0
        let visualEffectView = UIVisualEffectView()
        let glassEffect = UIGlassEffect()
        glassEffect.tintColor = UIColor.black.withAlphaComponent(0.3)
        glassEffect.isInteractive = true
        visualEffectView.effect = glassEffect
        visualEffectView.bounds = CGRect(x: 0, y: padding, width: frame.width - (2 * padding), height: frame.height)

        // visualEffectView.bounds = CGRect(x: padding, y: padding, width: frame.width - 2 * padding, height: frame.height)
        visualEffectView.overrideUserInterfaceStyle = FocusedInputHolder.shared.get()?.keyboardAppearanceValue == "dark" ? .dark : .light

        visualEffectView.contentView.addSubview(contentView)
        // contentView.bounds = visualEffectView.contentView.bounds

        return visualEffectView
      }
    #endif
    let inputView = UIInputView(frame: frame, inputViewStyle: .keyboard)
    inputView.addSubview(contentView)

    return inputView
  }
}
