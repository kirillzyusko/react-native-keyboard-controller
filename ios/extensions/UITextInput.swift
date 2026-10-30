//
//  UITextInput.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 04/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation
import UIKit

public extension UITextInput {
  /// `true` while RN applies a text update coming from JS (`RCTTextInputComponentView._comingFromJS`).
  /// RN re-assigns `attributedText`, which moves the selection to the end of the document, and restores
  /// the selection afterwards within the same call, so selection callbacks in between are transient.
  /// Paper has no such flag and `safeValue` returns `nil` there.
  var isUpdatingTextFromJS: Bool {
    guard let selfObj = self as? NSObject,
          let delegate = selfObj.safeValue(forKey: "textInputDelegate") as? NSObject,
          let comingFromJS = delegate.safeValue(forKey: "_comingFromJS") as? Bool
    else {
      return false
    }

    return comingFromJS
  }

  /// `false` while the selected position has no layout yet (`firstRect` is `CGRectNull`): a multiline input
  /// that still has to grow to fit a new line reports a bogus finite `caretRect` for it. Query it after reading
  /// `caretRect`: the probe advances TextKit 2's soft invalidation and can leave a freshly split paragraph
  /// unpositioned for the reads that follow it.
  var isSelectionLaidOut: Bool {
    guard let selectedRange = selectedTextRange,
          let range = textRange(from: selectedRange.start, to: selectedRange.end)
    else {
      return false
    }

    return firstRect(for: range).isFinite
  }
}

extension CGRect {
  var isFinite: Bool {
    return origin.x.isFinite && origin.y.isFinite && size.width.isFinite && size.height.isFinite
  }
}
