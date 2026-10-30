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
  /// `false` while the selected position has no layout yet (`firstRect` is `CGRectNull`): a multiline input
  /// that still has to grow to fit a new line reports a bogus finite `caretRect` for it. Query it after reading
  /// `caretRect`: the probe advances TextKit 2's soft invalidation and can leave a freshly split paragraph
  /// at origin zero for the reads that follow it.
  var isSelectionLaidOut: Bool {
    guard let selectedRange = selectedTextRange,
          let range = textRange(from: selectedRange.start, to: selectedRange.end)
    else {
      return false
    }

    return firstRect(for: range).isFinite
  }
}
