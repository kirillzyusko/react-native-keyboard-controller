//
//  CustomKeyboardContainerView.swift
//  Pods
//
//  Created by Vladyslav Martynov on 11/07/2026.
//

import UIKit

@objc
public class CustomKeyboardContainerView: NSObject {
  @objc public static func create(frame: CGRect, contentView: UIView) -> UIView {
    return ContainerView(frame: frame, contentView: contentView)
  }
}

private class ContainerView: UIInputView {
  var contentView: UIView!

  init(frame: CGRect, contentView: UIView) {
    super.init(frame: frame, inputViewStyle: .keyboard)
    self.contentView = contentView

    allowsSelfSizing = true
    autoresizingMask = [.flexibleHeight]

    addSubview(contentView)
    contentView.frame = bounds
  }

  @available(*, unavailable)
  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  private func calculateDesiredHeight() -> CGFloat {
    guard let firstSubview = contentView.subviews.first else { return 0 }
    return firstSubview.frame.height
  }

  override func layoutSubviews() {
    super.layoutSubviews()

    let desiredHeight = calculateDesiredHeight()

    if abs(frame.height - desiredHeight) > 0.001 {
      frame.size.height = desiredHeight

      contentView.frame = bounds

      invalidateIntrinsicContentSize()
      setNeedsLayout()
      UIResponder.current?.reloadInputViews()
    } else {
      contentView.frame = bounds
    }
  }

  override var intrinsicContentSize: CGSize {
    return CGSize(width: UIView.noIntrinsicMetric, height: frame.height)
  }
}
