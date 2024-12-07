//
//  TextInput.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 27/01/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation
import UIKit

public protocol TextInput: UIView {
  // default common methods/properties
  var inputView: UIView? { get set }
  func focus()
}

extension UITextField: TextInput {
  public func focus() {
    becomeFirstResponder()
  }
}

extension UITextView: TextInput {
  public func focus() {
    becomeFirstResponder()
  }
}
