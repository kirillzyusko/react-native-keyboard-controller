//
//  KeyboardControllerNativeTests.swift
//  KeyboardControllerNativeTests
//
//  Created by Kiryl Ziusko on 29/03/2024.
//

@testable import KeyboardControllerNative
import XCTest

extension XCTestCase {
  func waitForFocusChange(
    to textField: TestableInput,
    timeout: TimeInterval = 10.0,
    file: StaticString = #file,
    line: UInt = #line
  ) {
    let expectation = XCTestExpectation(description: "Wait for focus change to \(textField.tag)")

    XCTAssertFalse(
      textField.becomeFirstResponderCalled,
      "Expected focus shouldn't be initially set for tag \(textField.tag)"
    )

    DispatchQueue.main.async {
      XCTAssertTrue(
        textField.becomeFirstResponderCalled,
        "Expected focus to be set to text field with tag \(textField.tag)",
        file: file,
        line: line
      )
      expectation.fulfill()
    }

    wait(for: [expectation], timeout: timeout)
  }
}

protocol TestableInput: UIView, TextInput {
  var becomeFirstResponderCalled: Bool { get set }
  func becomeFirstResponder() -> Bool
}

class TestableTextField: UITextField, TestableInput {
  var becomeFirstResponderCalled = false

  override func becomeFirstResponder() -> Bool {
    becomeFirstResponderCalled = true
    return super.becomeFirstResponder()
  }
}

class TestableTextView: UITextView, TestableInput {
  var becomeFirstResponderCalled = false

  override func becomeFirstResponder() -> Bool {
    becomeFirstResponderCalled = true
    return super.becomeFirstResponder()
  }
}

final class KeyboardControllerNativeTests: XCTestCase {
  var rootView: UIView!
  var textFields: [TestableInput]!

  override func setUpWithError() throws {
    super.setUp()

    rootView = UIView()
    textFields = (1 ... 13).map { tag in
      let textField = (tag % 2 == 0 ? TestableTextField() : TestableTextView()) as TestableInput
      textField.tag = tag
      let isEditable = tag != 3 && tag != 4 // Assuming ids 3 and 4 are not editable, similar to our Android test
      (textField as? UITextField)?.isEnabled = isEditable
      (textField as? UITextView)?.isEditable = isEditable

      return textField
    }

    let subView = UIView()
    for (index, textField) in textFields.enumerated() {
      if index == 4 {
        rootView.addSubview(subView)
      }
      if index >= 4, index <= 6 {
        subView.addSubview(textField)
      } else {
        rootView.addSubview(textField)
      }
    }
  }

  override func tearDownWithError() throws {
    // Put teardown code here. This method is called after the invocation of each test method in the class.
  }

  func testSetFocusToNextShouldSetFocusToNextField() throws {
    let textInput1 = textFields[0]
    FocusedInputHolder.shared.set(textInput1)

    ViewHierarchyNavigator.setFocusTo(direction: "next")

    waitForFocusChange(to: textFields[1])
  }

  func testSetFocusToPrevShouldSetFocusToPreviousField() throws {
    let textInput2 = textFields[1]
    FocusedInputHolder.shared.set(textInput2)

    ViewHierarchyNavigator.setFocusTo(direction: "prev")

    waitForFocusChange(to: textFields[0])
  }

  func testSetFocusToNextShouldSkipNonEditableFields() throws {
    let textInput2 = textFields[1]
    FocusedInputHolder.shared.set(textInput2)

    ViewHierarchyNavigator.setFocusTo(direction: "next")

    waitForFocusChange(to: textFields[4])
  }

  func testSetFocusToPrevShouldSkipNonEditableFields() throws {
    let textInput5 = textFields[4]
    FocusedInputHolder.shared.set(textInput5)

    ViewHierarchyNavigator.setFocusTo(direction: "prev")

    waitForFocusChange(to: textFields[1])
  }

  func testSetFocusToNextWithinGroup() throws {
    let textInput5 = textFields[4]
    FocusedInputHolder.shared.set(textInput5)

    ViewHierarchyNavigator.setFocusTo(direction: "next")

    waitForFocusChange(to: textFields[5])
  }

  func testSetFocusToPrevWithinGroup() throws {
    let textInput6 = textFields[5]
    FocusedInputHolder.shared.set(textInput6)

    ViewHierarchyNavigator.setFocusTo(direction: "prev")

    waitForFocusChange(to: textFields[4])
  }

  func testSetFocusToNextExitsGroup() throws {
    let textInput7 = textFields[6]
    FocusedInputHolder.shared.set(textInput7)

    ViewHierarchyNavigator.setFocusTo(direction: "next")

    waitForFocusChange(to: textFields[7])
  }

  func testSetFocusToPrevEntersGroupAtLastElement() throws {
    let textInput8 = textFields[7]
    FocusedInputHolder.shared.set(textInput8)

    ViewHierarchyNavigator.setFocusTo(direction: "prev")

    waitForFocusChange(to: textFields[6])
  }
}
