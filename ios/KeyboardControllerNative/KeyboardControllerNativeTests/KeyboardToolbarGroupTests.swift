//
//  KeyboardToolbarGroupTests.swift
//  KeyboardControllerNativeTests
//
//  Created by Kiryl Ziusko on 10/03/2026.
//

@testable import KeyboardControllerNative
import XCTest

/// A mock group view whose type name matches what ViewHierarchyNavigator checks.
class KeyboardToolbarGroupView: UIView {}

final class KeyboardToolbarGroupTests: XCTestCase {
  var rootView: UIView!
  var groupView: KeyboardToolbarGroupView!
  var editText1: TestableInput!
  var editText2: TestableInput!
  var groupEditText1: TestableInput!
  var groupEditText2: TestableInput!
  var groupEditText3: TestableInput!
  var editText3: TestableInput!
  var editText4: TestableInput!

  override func setUpWithError() throws {
    super.setUp()

    rootView = UIView()
    groupView = KeyboardToolbarGroupView()

    editText1 = TestableTextField()
    editText1.tag = 1
    editText2 = TestableTextView()
    editText2.tag = 2
    groupEditText1 = TestableTextField()
    groupEditText1.tag = 3
    groupEditText2 = TestableTextView()
    groupEditText2.tag = 4
    groupEditText3 = TestableTextField()
    groupEditText3.tag = 5
    editText3 = TestableTextView()
    editText3.tag = 6
    editText4 = TestableTextField()
    editText4.tag = 7

    groupView.addSubview(groupEditText1)
    groupView.addSubview(groupEditText2)
    groupView.addSubview(groupEditText3)

    // Layout: editText1, editText2, [group: gET1, gET2, gET3], editText3, editText4
    rootView.addSubview(editText1)
    rootView.addSubview(editText2)
    rootView.addSubview(groupView)
    rootView.addSubview(editText3)
    rootView.addSubview(editText4)
  }

  // MARK: - getAllInputFields

  func testGetAllInputFieldsExcludesGroupInputs() {
    let allFields = ViewHierarchyNavigator.getAllInputFields(root: rootView)

    // Only editText1, editText2, editText3, editText4 (group inputs excluded)
    XCTAssertEqual(allFields.count, 4)
  }

  func testGetAllInputFieldsWithGroupRootReturnsOnlyGroupInputs() {
    let groupFields = ViewHierarchyNavigator.getAllInputFields(root: groupView)

    XCTAssertEqual(groupFields.count, 3)
  }

  // MARK: - Navigation within group

  func testNextInsideGroupStaysWithinGroup() {
    FocusedInputHolder.shared.set(groupEditText1 as? TextInput)

    ViewHierarchyNavigator.setFocusTo(direction: "next")

    waitForFocusChange(to: groupEditText2)
  }

  func testPrevInsideGroupStaysWithinGroup() {
    FocusedInputHolder.shared.set(groupEditText3 as? TextInput)

    ViewHierarchyNavigator.setFocusTo(direction: "prev")

    waitForFocusChange(to: groupEditText2)
  }

  // MARK: - Group boundary: cannot leave

  func testNextAtLastGroupInputDoesNotLeaveGroup() {
    FocusedInputHolder.shared.set(groupEditText3 as? TextInput)

    ViewHierarchyNavigator.setFocusTo(direction: "next")

    // Should NOT move to editText3 — should stay at groupEditText3
    let expectation = XCTestExpectation(description: "Wait for main queue")
    DispatchQueue.main.async {
      if let input = self.editText3 as? TestableInput {
        XCTAssertFalse(
          input.becomeFirstResponderCalled,
          "Should not have moved focus to editText3 outside group"
        )
      } else {
        XCTFail("editText3 is not a TestableInput")
      }
      expectation.fulfill()
    }
    wait(for: [expectation], timeout: 10.0)
  }

  func testPrevAtFirstGroupInputDoesNotLeaveGroup() {
    FocusedInputHolder.shared.set(groupEditText1 as? TextInput)

    ViewHierarchyNavigator.setFocusTo(direction: "prev")

    // Should NOT move to editText2 — should stay at groupEditText1
    let expectation = XCTestExpectation(description: "Wait for main queue")
    DispatchQueue.main.async {
      if let input = self.editText2 as? TestableInput {
        XCTAssertFalse(
          input.becomeFirstResponderCalled,
          "Should not have moved focus to editText2 outside group"
        )
      } else {
        XCTFail("editText2 is not a TestableInput")
      }
      expectation.fulfill()
    }
    wait(for: [expectation], timeout: 10.0)
  }

  // MARK: - Navigation outside group skips group inputs

  func testNextOutsideGroupSkipsGroupInputs() {
    FocusedInputHolder.shared.set(editText2 as? TextInput)

    ViewHierarchyNavigator.setFocusTo(direction: "next")

    // Should skip group and go to editText3
    waitForFocusChange(to: editText3)
  }

  func testPrevOutsideGroupSkipsGroupInputs() {
    FocusedInputHolder.shared.set(editText3 as? TextInput)

    ViewHierarchyNavigator.setFocusTo(direction: "prev")

    // Should skip group and go to editText2
    waitForFocusChange(to: editText2)
  }

  // MARK: - findGroupAncestor

  func testFindGroupAncestorReturnsGroupForInputsInsideGroup() {
    let ancestor = ViewHierarchyNavigator.findGroupAncestor(groupEditText1)

    XCTAssertTrue(ancestor === groupView)
  }

  func testFindGroupAncestorReturnsNilForInputsOutsideGroup() {
    let ancestor = ViewHierarchyNavigator.findGroupAncestor(editText1)

    XCTAssertNil(ancestor)
  }
}
