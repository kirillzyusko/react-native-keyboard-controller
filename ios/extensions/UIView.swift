//
//  UIView.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 04/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation
import UIKit

public extension UIView {
  var globalFrame: CGRect? {
    let rootView = UIApplication.shared.keyWindow?.rootViewController?.view
    return superview?.convert(frame, to: rootView)
  }
}

public extension Optional where Wrapped == UIView {
  var frameTransitionInWindow: (Double, Double) {
    let areCrossFadeTransitionsEnabled = (self?.layer.presentation()?.animationKeys() ?? []).contains("opacity")
    let frameY = self?.layer.presentation()?.frame.origin.y ?? 0
    let windowH = self?.window?.bounds.size.height ?? 0
    var position = windowH - frameY

    // when cross fade transitions enabled, then keyboard changes
    // its `opacity` instead of `translateY`, so we handle it here
    if areCrossFadeTransitionsEnabled {
      let opacity = self?.layer.presentation()?.opacity ?? 0
      position = CGFloat(opacity) * position
    }

    return (position, frameY)
  }
}
