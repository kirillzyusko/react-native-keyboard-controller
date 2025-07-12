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
        let paddingHorizontal = 20.0
        let paddingBottom = 10.0
        let isDark = FocusedInputHolder.shared.get()?.keyboardAppearanceValue == "dark"

        let glassEffect = glassEffectClass.init()
        let color = isDark ? UIColor.black.withAlphaComponent(0.3) : UIColor.gray.withAlphaComponent(0.3)
        glassEffect.setValue(color, forKey: "tintColor")
        glassEffect.setValue(true, forKey: "interactive")

        // wrapper container will be full frame
        let wrapperView = UIView(frame: frame)
        wrapperView.backgroundColor = .clear

        let innerWidth = frame.width - paddingHorizontal * 2
        let innerHeight = frame.height

        let visualEffectView = UIVisualEffectView(effect: glassEffect)
        visualEffectView.overrideUserInterfaceStyle = isDark ? .dark : .light

        visualEffectView.frame = CGRect(
          x: paddingHorizontal,
          y: -paddingBottom,
          width: innerWidth,
          height: innerHeight
        )
        contentView.frame = CGRect(
          x: -paddingHorizontal,
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
