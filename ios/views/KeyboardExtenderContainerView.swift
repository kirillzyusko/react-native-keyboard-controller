//
//  KeyboardExtenderContainerView.swift
//  Pods
//
//  Created by Kiryl Ziusko on 11/07/2025.
//

import UIKit

@objc
public class KeyboardExtenderContainerView: UIView {
  @objc public static func create(frame: CGRect, contentView: UIView) -> UIView {
    if #available(iOS 26.0, *) {
      // backward compatibility with old XCode versions
      if let glassEffectClass = NSClassFromString("UIGlassEffect") as? UIVisualEffect.Type {
        let glassEffect = glassEffectClass.init()
        glassEffect.setValue(UIColor.black.withAlphaComponent(0.3), forKey: "tintColor")
        glassEffect.setValue(true, forKey: "interactive")

        let padding = 20.0
        let visualEffectView = UIVisualEffectView()
        visualEffectView.effect = glassEffect
        visualEffectView.bounds = CGRect(
          x: 0,
          y: padding,
          width: frame.width - (2 * padding),
          height: frame.height
        )

        visualEffectView.overrideUserInterfaceStyle =
          FocusedInputHolder.shared.get()?.keyboardAppearanceValue == "dark" ? .dark : .light

        visualEffectView.contentView.addSubview(contentView)

        return visualEffectView
      }
    }

    let inputView = UIInputView(frame: frame, inputViewStyle: .keyboard)
    inputView.addSubview(contentView)

    return inputView
  }
}
