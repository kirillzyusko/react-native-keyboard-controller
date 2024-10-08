//
//  TimingAnimationPerformanceTest.swift
//  KeyboardControllerNativeTests
//
//  Created by Kiryl Ziusko on 08/10/2024.
//

import XCTest

final class TimingAnimationPerformanceTest: XCTestCase {
  let timingAnimation: CABasicAnimation = {
    let basicAnimation = CABasicAnimation()
    basicAnimation.timingFunction = CAMediaTimingFunction(name: CAMediaTimingFunctionName.easeInEaseOut)
    basicAnimation.speed = 1.0
    basicAnimation.duration = 0.14518900343642613

    return basicAnimation
  }()

  func testTimingAnimationValueAt() throws {
    let animation = TimingAnimation(animation: timingAnimation, fromValue: 122, toValue: 291)
    XCTAssertEqual(animation.valueAt(time: 0.01), 123.56118966540286)
    XCTAssertEqual(animation.valueAt(time: 0.05), 163.8067164607386)
    XCTAssertEqual(animation.valueAt(time: 0.0), 122.0)
    XCTAssertEqual(animation.valueAt(time: 0.124781), 284.31306189738245)
    XCTAssertEqual(animation.valueAt(time: 0.143954), 290.97699741147824)
  }

  func testPerformanceExample() throws {
    // This is an example of a performance test case.
    measure {
      // Put the code you want to measure the time of here.
    }
  }
}
