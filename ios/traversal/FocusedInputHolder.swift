//
//  FocusedInputHolder.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 27/01/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation

class FocusedInputHolder {
  static let shared = FocusedInputHolder()

  // Using TextInput protocol as the type for currentFocusedInput
  private weak var currentFocusedInput: TextInput?

  // Sets the currentFocusedInput to the passed instance conforming to TextInput or clears it if nil is passed
  func set(_ input: TextInput?) {
    currentFocusedInput = input
  }

  // Requests focus for the currentFocusedInput if it's set
  func requestFocus() {
    currentFocusedInput?.requestFocus()
  }

  func get() -> TextInput? {
    return currentFocusedInput
  }

  private init() {}
}
