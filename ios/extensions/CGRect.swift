//
//  CGRect.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 30/10/2026.
//  Copyright © 2026 Facebook. All rights reserved.
//

import Foundation

public extension CGRect {
  /// `false` for `CGRectNull` and any other rectangle with an infinite or undefined component,
  /// which is what `UITextInput` geometry queries return for a position that has no layout yet.
  var isFinite: Bool {
    return origin.x.isFinite && origin.y.isFinite && size.width.isFinite && size.height.isFinite
  }
}
