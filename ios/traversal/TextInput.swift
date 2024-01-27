//
//  TextInput.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 27/01/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation
import UIKit

public protocol TextInput: AnyObject {
  func requestFocus()
}

extension UITextField: TextInput {
  public func requestFocus() {
    becomeFirstResponder()
  }
}

extension UITextView: TextInput {
  public func requestFocus() {
    becomeFirstResponder()
  }
}
