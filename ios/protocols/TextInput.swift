//
//  TextInput.swift
//  Pods
//
//  Created by Kiryl Ziusko on 01/11/2024.
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
