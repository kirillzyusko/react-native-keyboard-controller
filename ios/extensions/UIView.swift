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
  var framePositionInWindow: (Double, Double) {
    let frameY = self?.layer.presentation()?.frame.origin.y ?? 0
    let windowH = self?.window?.bounds.size.height ?? 0
    let position = windowH - frameY

    return (position, frameY)
  }
}
