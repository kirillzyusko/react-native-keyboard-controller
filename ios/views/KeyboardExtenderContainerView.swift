//
//  KeyboardExtenderContainerView.swift
//  Pods
//
//  Created by Kiryl Ziusko on 11/07/2025.
//

import UIKit

@objc
public class KeyboardExtenderContainerView: NSObject {
  @objc public static func create(frame: CGRect, contentView: UIView) -> UIView {
    #if canImport(UIKit.UIGlassEffect)
      if #available(iOS 26.0, *) {
        return ModernContainerView(frame: frame, contentView: contentView)
      }
    #endif

    return LegacyContainerView(frame: frame, contentView: contentView)
  }
}

private class BaseContainerView: UIInputView {
  var contentView: UIView!

  init(frame: CGRect, contentView: UIView) {
    super.init(frame: frame, inputViewStyle: .keyboard)
    self.contentView = contentView
    commonSetup()
  }

  @available(*, unavailable)
  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  private func commonSetup() {
    allowsSelfSizing = true
    autoresizingMask = [.flexibleHeight]
    setupContainerSpecifics()
  }

  func setupContainerSpecifics() {
    // Override in subclasses
  }

  func calculateDesiredHeight() -> CGFloat {
    guard let firstSubview = contentView.subviews.first else { return 0 }
    return firstSubview.frame.height
  }

  override func layoutSubviews() {
    super.layoutSubviews()

    let desiredHeight = calculateDesiredHeight()

    if frame.height != desiredHeight {
      frame.size.height = desiredHeight

      updateContentFrame(desiredHeight: desiredHeight)

      // Trigger layout updates
      invalidateIntrinsicContentSize()
      setNeedsLayout()
      UIResponder.current?.reloadInputViews()
    }
  }

  func updateContentFrame(desiredHeight _: CGFloat) {
    // Override in subclasses
  }

  override var intrinsicContentSize: CGSize {
    return CGSize(width: UIView.noIntrinsicMetric, height: frame.height)
  }
}

// MARK: - Modern Implementation (iOS 26.0+)

@available(iOS 26.0, *)
private class ModernContainerView: BaseContainerView {
  private let paddingHorizontal: CGFloat = 20.0
  private let paddingBottom: CGFloat = 10.0
  private var visualEffectView: UIVisualEffectView?

  override func setupContainerSpecifics() {
    setupVisualEffect()
  }

  private func setupVisualEffect() {
    #if canImport(UIKit.UIGlassEffect)
      let isDark = FocusedInputHolder.shared.get()?.keyboardAppearanceValue == "dark"
      let glassEffect = UIGlassEffect()
      let color =
        isDark ? UIColor.black.withAlphaComponent(0.3) : UIColor.gray.withAlphaComponent(0.3)
      glassEffect.tintColor = color
      glassEffect.isInteractive = true

      visualEffectView = UIVisualEffectView(effect: glassEffect)
      visualEffectView?.overrideUserInterfaceStyle = isDark ? .dark : .light
      visualEffectView?.cornerConfiguration = .capsule()

      if let visualEffectView = visualEffectView {
        visualEffectView.contentView.addSubview(contentView)
        addSubview(visualEffectView)
      }
    #endif
  }

  override func updateContentFrame(desiredHeight: CGFloat) {
    visualEffectView?.frame = CGRect(
      x: paddingHorizontal,
      y: -paddingBottom,
      width: bounds.width - 2 * paddingHorizontal,
      height: desiredHeight
    )
    contentView.frame = CGRect(
      x: -paddingHorizontal,
      y: 0,
      width: bounds.width,
      height: desiredHeight
    )
  }
}

// MARK: - Legacy Implementation (Pre-iOS 26.0)

private class LegacyContainerView: BaseContainerView {
  override func setupContainerSpecifics() {
    addSubview(contentView)
  }

  override func updateContentFrame(desiredHeight _: CGFloat) {
    contentView.frame = bounds
  }
}
