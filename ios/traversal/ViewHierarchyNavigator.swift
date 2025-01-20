//
//  ViewHierarchyNavigator.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 28/12/2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import UIKit

@objc(ViewHierarchyNavigator)
public class ViewHierarchyNavigator: NSObject {
  @objc public static func setFocusTo(direction: String) {
    DispatchQueue.main.async {
      if direction == "current" {
        let input = FocusedInputHolder.shared.get()
        input?.inputView = nil
        input?.reloadInputViews()
        input?.focus()
        return
      }

      let input = FocusedInputHolder.shared.get() ?? (UIResponder.current as? UIView) ?? nil
      guard let view = input else { return }

      let textField = findTextInputInDirection(currentFocus: view, direction: direction)
      textField?.focus()
    }
  }

  public static func getAllInputFields() -> [TextInput] {
    var textInputs = [TextInput]()

    guard let rootView = UIApplication.topViewController()?.view else {
      return []
    }

    // Helper function to recursively search for TextInput views
    func findTextInputs(in view: UIView?) {
      guard let view = view else { return }

      if let textInput = isValidTextInput(view) {
        textInputs.append(textInput)
      } else {
        for subview in view.subviews {
          findTextInputs(in: subview)
        }
      }
    }

    findTextInputs(in: rootView)

    return textInputs
  }

  private static func findTextInputInDirection(currentFocus: UIView, direction: String) -> TextInput? {
    // Find the parent view group
    guard let parentViewGroup = currentFocus.superview else {
      return nil
    }

    // Find the index of the current TextInput in its parent
    let currentIndex = parentViewGroup.subviews.firstIndex(of: currentFocus) ?? 0

    // Define the range for iterating based on the direction
    let range: [Int]

    if direction == "next" {
      range = Array((currentIndex + 1) ..< parentViewGroup.subviews.count)
    } else {
      range = Array(stride(from: currentIndex - 1, through: 0, by: -1))
    }

    // Iterate over the range to find the next or previous TextInput
    for i in range {
      let nextChild = parentViewGroup.subviews[i]

      if let nextTextInput = findTextInputInHierarchy(view: nextChild, direction: direction) {
        return nextTextInput
      }
    }

    // If no next or previous sibling was found in the parent, recurse to the parent's parent
    return findTextInputInDirection(currentFocus: parentViewGroup, direction: direction)
  }

  private static func findTextInputInHierarchy(view: UIView, direction: String) -> TextInput? {
    // Check the current view
    if let validTextInput = isValidTextInput(view) {
      return validTextInput
    }

    // Determine the iteration order based on the direction
    let subviews = direction == "next" ? view.subviews : view.subviews.reversed()

    // Iterate over subviews
    for subview in subviews {
      if let textField = findTextInputInHierarchy(view: subview, direction: direction) {
        return textField
      }
    }

    return nil // No valid UITextField or UITextView found
  }

  // Function to check if the view is a valid text field or text view
  private static func isValidTextInput(_ view: UIView) -> TextInput? {
    if let textField = view as? UITextField, textField.isEnabled {
      return textField
    }

    if let textView = view as? UITextView, textView.isEditable {
      return textView
    }

    return nil
  }
}
