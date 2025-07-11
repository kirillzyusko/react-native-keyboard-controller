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
      if let glassEffectClass = NSClassFromString("UIGlassEffect") as? UIVisualEffect.Type {
        let padding = 20.0
        let isDark = FocusedInputHolder.shared.get()?.keyboardAppearanceValue == "dark"

        let glassEffect = glassEffectClass.init()
        let color = isDark ? UIColor.black.withAlphaComponent(0.3) : UIColor.gray.withAlphaComponent(0.3)
        glassEffect.setValue(color, forKey: "tintColor")
        glassEffect.setValue(true, forKey: "interactive")

        // wrapper container will be full frame
        let wrapperView = UIView(frame: frame)
        wrapperView.backgroundColor = .clear

        let innerWidth = frame.width - padding * 2
        let innerHeight = frame.height

        let visualEffectView = UIVisualEffectView(effect: glassEffect)
        visualEffectView.overrideUserInterfaceStyle = isDark ? .dark : .light

        visualEffectView.frame = CGRect(
          x: padding,
          y: -padding,
          width: innerWidth,
          height: innerHeight
        )
        contentView.frame = CGRect(
          x: -padding,
          y: 0,
          width: innerWidth,
          height: innerHeight
        )

        visualEffectView.contentView.addSubview(contentView)
        wrapperView.addSubview(visualEffectView)

        return wrapperView
      }
    }

    let inputView = UIInputView(frame: frame, inputViewStyle: .keyboard)
    contentView.frame = inputView.bounds
    inputView.addSubview(contentView)
    return inputView
  }
}
