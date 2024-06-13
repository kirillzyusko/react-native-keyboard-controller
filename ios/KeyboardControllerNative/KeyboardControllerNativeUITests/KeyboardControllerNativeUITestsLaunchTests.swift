//
//  KeyboardControllerNativeUITestsLaunchTests.swift
//  KeyboardControllerNativeUITests
//
//  Created by Kiryl Ziusko on 29/03/2024.
//

import XCTest

// swiftlint:disable:next type_name
final class KeyboardControllerNativeUITestsLaunchTests: XCTestCase {
  override static var runsForEachTargetApplicationUIConfiguration: Bool {
    true
  }

  override func setUpWithError() throws {
    continueAfterFailure = false
  }

  func testLaunch() throws {
    let app = XCUIApplication()
    app.launch()

    // Insert steps here to perform after app launch but before taking a screenshot,
    // such as logging into a test account or navigating somewhere in the app

    let attachment = XCTAttachment(screenshot: app.screenshot())
    attachment.name = "Launch Screen"
    attachment.lifetime = .keepAlways
    add(attachment)
  }
}
