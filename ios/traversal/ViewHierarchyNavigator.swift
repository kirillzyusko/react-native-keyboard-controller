//
//  ViewHierarchyNavigator.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 28/12/2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import UIKit

protocol TextField {
  func requestFocus()
}

extension UITextField: TextField {
  func requestFocus() {
    becomeFirstResponder()
  }
}

extension UITextView: TextField {
  func requestFocus() {
    becomeFirstResponder()
  }
}

@objc(ViewHierarchyNavigator)
public class ViewHierarchyNavigator: NSObject {
  @objc public static func setFocusTo(direction: String) {
    DispatchQueue.main.async {
      guard let view = UIResponder.current as? UIView else {
        // return nil
        return
      }

      let textField = findTextFieldInDirection(currentFocus: view, direction: direction)
      textField?.requestFocus()
      let allInputFields = ViewHierarchyNavigator.getAllInputFields()
      let currentIndex = ViewHierarchyNavigator.getCurrentFocusedInputIndex()

      print("All Input Fields: \(allInputFields.count)")
      print("Current Focused Input Index: \(currentIndex)")
    }
    // return textField
  }

  private static func findTextFieldInDirection(currentFocus: UIView, direction: String) -> TextField? {
    // Find the parent view group
    guard let parentViewGroup = currentFocus.superview else {
      return nil
    }

    // Find the index of the current TextField in its parent
    let currentIndex = parentViewGroup.subviews.firstIndex(of: currentFocus) ?? 0

    // Define the range for iterating based on the direction
    let range: [Int]

    if direction == "next" {
      range = Array((currentIndex + 1) ..< parentViewGroup.subviews.count)
    } else {
      range = Array(stride(from: currentIndex - 1, through: 0, by: -1))
    }

    // Iterate over the range to find the next or previous TextField
    for i in range {
      let nextChild = parentViewGroup.subviews[i]

      if let nextTextField = findTextFieldInHierarchy(view: nextChild, direction: direction) {
        return nextTextField
      }
    }

    // If no next or previous sibling was found in the parent, recurse to the parent's parent
    return findTextFieldInDirection(currentFocus: parentViewGroup, direction: direction)
  }

  private static func findTextFieldInHierarchy(view: UIView, direction: String) -> TextField? {
    // Check the current view
    if let validTextField = isValidTextField(view) {
      return validTextField
    }

    // Determine the iteration order based on the direction
    let subviews = direction == "next" ? view.subviews : view.subviews.reversed()

    // Iterate over subviews
    for subview in subviews {
      if let textField = findTextFieldInHierarchy(view: subview, direction: direction) {
        return textField
      }
    }

    return nil // No valid UITextField or UITextView found
  }

  // Function to check if the view is a valid text field or text view
  private static func isValidTextField(_ view: UIView) -> TextField? {
    if let textField = view as? UITextField, textField.isEnabled {
      return textField
    }

    if let textView = view as? UITextView, textView.isEditable {
      return textView
    }

    return nil
  }

  private static func getAllInputFields() -> [TextField] {
    guard let rootView = UIApplication.shared.keyWindow?.rootViewController?.view else {
      return []
    }

    var inputFields: [TextField] = []
    findAllTextFieldsInHierarchy(view: rootView, inputFields: &inputFields)

    return inputFields
  }

  private static func getCurrentFocusedInputIndex() -> Int? {
    guard let currentFocus = UIResponder.current as? UIView else {
      return nil
    }

    let allInputFields = getAllInputFields()

    if let currentIndex = allInputFields.firstIndex(where: { $0 as? UIView == currentFocus }) {
      return currentIndex
    }

    return nil
  }

  private static func findAllTextFieldsInHierarchy(view: UIView, inputFields: inout [TextField]) {
    for subview in view.subviews {
      if let textField = findTextFieldInHierarchy(view: subview, direction: "next") {
        // Check if the textField is not already in the array
        if !inputFields.contains(where: { $0 as? UIView == textField as? UIView }) {
          inputFields.append(textField)
        }
      }
      findAllTextFieldsInHierarchy(view: subview, inputFields: &inputFields)
    }
  }
}
