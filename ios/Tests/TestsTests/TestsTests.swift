//
//  TestsTests.swift
//  TestsTests
//
//  Created by Kiryl Ziusko on 21/02/2024.
//

import XCTest
@testable import Tests

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

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testExample() throws {
            // Setup
            let rootView = UIView()
            let firstTextInput = TestableTextField()
            firstTextInput.isEnabled = true
            let secondTextInput = TestableTextView()
            secondTextInput.isEditable = true
            let nonTextInput = UIView()
            rootView.addSubview(firstTextInput)
            rootView.addSubview(nonTextInput) // Non-text input view
            rootView.addSubview(secondTextInput)
        
            FocusedInputHolder.shared.set(firstTextInput)

            XCTAssertFalse(secondTextInput.becomeFirstResponderCalled, "The focus should be set to the second text input")
        
            ViewHierarchyNavigator.setFocusTo(direction: "next")
        
            let expectation = XCTestExpectation(description: "Wait for next focus change")
            DispatchQueue.main.async {
                XCTAssertTrue(secondTextInput.becomeFirstResponderCalled, "The focus should be set to the second text input")
                expectation.fulfill()
            }
            wait(for: [expectation], timeout: 10.0)
    }

    func testPerformanceExample() throws {
        // This is an example of a performance test case.
        self.measure {
            // Put the code you want to measure the time of here.
        }
    }

}
