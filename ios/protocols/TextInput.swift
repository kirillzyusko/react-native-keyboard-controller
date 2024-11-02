//
//  TextInput.swift
//  Pods
//
//  Created by Kiryl Ziusko on 01/11/2024.
//

import UIKit

public protocol TextInput: UIView {
  // default common methods/properties
  var inputAccessoryView: UIView? { get set }
  var inputView: UIView? { get set }
  var keyboardType: UIKeyboardType { get }
  var keyboardAppearance: UIKeyboardAppearance { get }
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
