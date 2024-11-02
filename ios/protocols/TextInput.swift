//
//  TextInput.swift
//  Pods
//
//  Created by Kiryl Ziusko on 01/11/2024.
//

public protocol TextInput: AnyObject {
  // default common methods/properties
  var inputAccessoryView: UIView? { get set }
  func reloadInputViews()
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
