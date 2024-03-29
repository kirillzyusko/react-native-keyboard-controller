//
//  TestsTests.swift
//  TestsTests
//
//  Created by Kiryl Ziusko on 21/02/2024.
//

@testable import Tests
import XCTest

extension XCTestCase {
  func waitForFocusChange(to textField: TestableTextField, timeout: TimeInterval = 10.0, file: StaticString = #file, line: UInt = #line) {
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

class TestableTextField: UITextField {
  var becomeFirstResponderCalled = false

  override func becomeFirstResponder() -> Bool {
    becomeFirstResponderCalled = true
    return super.becomeFirstResponder()
  }
}

class TestableTextView: UITextView {
  var becomeFirstResponderCalled = false

  override func becomeFirstResponder() -> Bool {
    becomeFirstResponderCalled = true
    return super.becomeFirstResponder()
  }
}

final class TestsTests: XCTestCase {
  var rootView: UIView!
  var textFields: [TestableTextField]!

  override func setUpWithError() throws {
    super.setUp()
    rootView = UIView()
    textFields = (1 ... 13).map { id in
      let textField = TestableTextField()
      textField.tag = id
      textField.isEnabled = id != 3 && id != 4 // Assuming ids 3 and 4 are not editable, similar to our Android test
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

  // TODO: get all, testSetFocusToNextDoesNothingIfLastElement, testSetFocusToPrevDoesNothingIfFirstElement
  func testPerformanceExample() throws {
    // This is an example of a performance test case.
    measure {
      // Put the code you want to measure the time of here.
    }
  }
}
