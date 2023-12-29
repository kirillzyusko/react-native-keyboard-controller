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
  @objc public func moveFocusTo(direction: String) {
    DispatchQueue.main.async {
      guard let view = UIResponder.current as? UIView else {
        // return nil
        return
      }

      let textField = direction == "next" ? self.findNextTextField(currentFocus: view) : self.findPreviousTextField(currentFocus: view)
      textField?.requestFocus()
    }
    // return textField
  }

  func findNextTextField(currentFocus: UIView) -> TextField? {
    // Find the parent view group
    guard let parentViewGroup = currentFocus.superview else {
      return nil
    }

    // Find the index of the current TextField in its parent
    let currentIndex = parentViewGroup.subviews.firstIndex(of: currentFocus) ?? 0

    // Check for the next sibling in the parent
    for i in (currentIndex + 1) ..< parentViewGroup.subviews.count {
      let nextChild = parentViewGroup.subviews[i]

      if let nextTextField = findTextFieldInHierarchy(view: nextChild) {
        return nextTextField
      }
    }

    // If no next sibling was found in the parent, recurse to the parent's parent
    return findNextTextField(currentFocus: parentViewGroup)
  }

  func findPreviousTextField(currentFocus: UIView) -> TextField? {
    // Find the parent view group
    guard let parentViewGroup = currentFocus.superview else {
      return nil
    }

    // Find the index of the current TextField in its parent
    let currentIndex = parentViewGroup.subviews.firstIndex(of: currentFocus) ?? parentViewGroup.subviews.count

    // Check for the previous sibling in the parent
    for i in stride(from: currentIndex - 1, through: 0, by: -1) {
      let previousChild = parentViewGroup.subviews[i]

      if let previousTextField = findTextFieldInHierarchy(view: previousChild) {
        return previousTextField
      }
    }

    // If no previous sibling was found in the parent, recurse to the parent's parent
    return findPreviousTextField(currentFocus: parentViewGroup)
  }

  func findTextFieldInHierarchy(view: UIView) -> TextField? {
    if let textField = view as? UITextField {
      return textField
    }

    if let textView = view as? UITextView {
      return textView
    }

    // If the current view is not a UITextField, check its subviews recursively
    for subview in view.subviews {
      if let textField = findTextFieldInHierarchy(view: subview) {
        return textField
      }
    }

    return nil // No UITextField found in the current view group
  }
}
