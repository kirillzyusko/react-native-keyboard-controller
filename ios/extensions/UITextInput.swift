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
  var canSelectionFitIntoLayout: Bool {
    guard let selectedRange = selectedTextRange else { return false }

    guard let range = textRange(from: selectedRange.start, to: selectedRange.end) else { return false }
    let rect = firstRect(for: range)

    return rect.origin.x.isFinite && rect.origin.y.isFinite
  }
}
