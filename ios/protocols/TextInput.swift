//
//  TextInput.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 27/01/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import UIKit

public protocol TextInput: AnyObject {
  // default common methods/properties
  func reloadInputViews()
  var inputAccessoryView: UIView? { get set }
  var keyboardType: UIKeyboardType { get }
  // custom methods/properties
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
