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
  private static let groupViewTypeName = "KeyboardToolbarGroupView"

  /// Returns the subviews of the given view in a way that's safe to iterate
  /// from Swift on Mac Catalyst.
  ///
  /// On Catalyst running in the Mac idiom, `view.subviews` can contain host
  /// containers (e.g. UIRemoteView wrappers around Mac-side AppKit views)
  /// whose pointers cannot be bridged to UIView at the Swift level. Iterating
  /// the standard Swift `[UIView]` array trips a `swift_dynamicCast` SIGSEGV
  /// whenever one of those entries is encountered. Enumerating via Objective-C
  /// KVC instead gives us an untyped NSArray we can defensively cast and skip.
  ///
  /// On any other platform this returns `view.subviews` directly — no behaviour
  /// or performance change.
  private static func safeSubviews(of view: UIView) -> [UIView] {
    #if targetEnvironment(macCatalyst)
    if UIDevice.current.userInterfaceIdiom == .mac {
      guard let raw = view.value(forKey: "subviews") as? NSArray else { return [] }
      var result: [UIView] = []
      result.reserveCapacity(raw.count)
      for entry in raw {
        if let subview = entry as? UIView {
          result.append(subview)
        }
      }
      return result
    }
    #endif
    return view.subviews
  }

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
    return getAllInputFields(root: nil)
  }

  public static func getAllInputFields(root: UIView?) -> [TextInput] {
    var textInputs = [TextInput]()

    let rootView: UIView?
    if let root = root {
      rootView = root
    } else {
      rootView = UIApplication.topViewController()?.view
    }

    guard let rootView = rootView else {
      return []
    }

    let isGroupRoot = isGroupView(rootView)

    /// Helper function to recursively search for TextInput views
    func findTextInputs(in view: UIView?) {
      guard let view = view else { return }

      if let textInput = isValidTextInput(view) {
        textInputs.append(textInput)
      } else if !isGroupView(view) {
        for subview in safeSubviews(of: view) {
          findTextInputs(in: subview)
        }
      }
    }

    if isGroupRoot {
      // When root is a group, search its children directly
      for subview in safeSubviews(of: rootView) {
        findTextInputs(in: subview)
      }
    } else {
      findTextInputs(in: rootView)
    }

    return textInputs
  }

  /// Finds the closest KeyboardToolbarGroupView ancestor of the given view.
  /// Returns nil if the view is not inside any group.
  public static func findGroupAncestor(_ view: UIView?) -> UIView? {
    var current = view?.superview
    while let parent = current {
      if isGroupView(parent) {
        return parent
      }
      current = parent.superview
    }
    return nil
  }

  private static func isGroupView(_ view: UIView) -> Bool {
    return String(describing: type(of: view)) == groupViewTypeName
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

    // Don't navigate outside the group boundary
    if isGroupView(parentViewGroup) {
      return nil
    }

    // If no next or previous sibling was found in the parent, recurse to the parent's parent
    return findTextInputInDirection(currentFocus: parentViewGroup, direction: direction)
  }

  private static func findTextInputInHierarchy(view: UIView, direction: String) -> TextInput? {
    // Check the current view
    if let validTextInput = isValidTextInput(view) {
      return validTextInput
    }

    guard !isGroupView(view) else { return nil }

    // Determine the iteration order based on the direction
    let children = safeSubviews(of: view)
    let subviews: [UIView] = direction == "next" ? children : children.reversed()

    // Iterate over subviews
    for subview in subviews {
      if let textField = findTextInputInHierarchy(view: subview, direction: direction) {
        return textField
      }
    }

    return nil // No valid UITextField or UITextView found
  }

  /// Function to check if the view is a valid text field or text view
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
