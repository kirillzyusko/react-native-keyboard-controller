//
//  TimingAnimationPerformanceTest.swift
//  KeyboardControllerNativeTests
//
//  Created by Kiryl Ziusko on 08/10/2024.
//

import XCTest

final class TimingAnimationPerformanceTest: XCTestCase {
  static let duration = 0.14518900343642613

  let options: XCTMeasureOptions = {
    let opts = XCTMeasureOptions()
    opts.iterationCount = 10
    return opts
  }()

  let timingAnimation: CABasicAnimation = {
    let basicAnimation = CABasicAnimation()
    basicAnimation.timingFunction = CAMediaTimingFunction(name: CAMediaTimingFunctionName.easeInEaseOut)
    basicAnimation.speed = 1.0
    basicAnimation.duration = duration

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

  func testValueAtPerformance() throws {
    let animation = TimingAnimation(animation: timingAnimation, fromValue: 122, toValue: 291)
    measure(metrics: [XCTCPUMetric(), XCTClockMetric()], options: options) {
      for time in stride(from: 0.0, through: TimingAnimationPerformanceTest.duration, by: 0.000002) {
        _ = animation.valueAt(time: time)
      }
    }
  }
}
