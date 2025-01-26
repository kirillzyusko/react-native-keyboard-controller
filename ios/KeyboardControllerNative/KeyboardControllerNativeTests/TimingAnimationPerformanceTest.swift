//
//  TimingAnimationPerformanceTest.swift
//  KeyboardControllerNativeTests
//
//  Created by Kiryl Ziusko on 08/10/2024.
//

import XCTest

final class TimingAnimationPerformanceTest: XCTestCase {
  static let duration = 0.14518900343642613
  static let fromValue = 122.0
  static let toValue = 291.0

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

  var animation: TimingAnimation {
    return TimingAnimation(
      animation: timingAnimation,
      fromValue: TimingAnimationPerformanceTest.fromValue,
      toValue: TimingAnimationPerformanceTest.toValue
    )
  }

  func testTimingAnimationValueAt() throws {
    XCTAssertEqual(animation.valueAt(time: 0.01), 123.56118966540286)
    XCTAssertEqual(animation.valueAt(time: 0.05), 163.8067164607386)
    XCTAssertEqual(animation.valueAt(time: 0.0), 122.0)
    XCTAssertEqual(animation.valueAt(time: 0.124781), 284.31306189738245)
    XCTAssertEqual(animation.valueAt(time: 0.143954), 290.97699741147824)
  }

  func testTimingAnimationTimingAt() throws {
    XCTAssertEqual(animation.timingAt(value: 123.56118966540286), 0.010046876612582212)
    XCTAssertEqual(animation.timingAt(value: 163.8067164607386), 0.050004940820975737)
    XCTAssertEqual(animation.timingAt(value: 122.0), 0.0008425121366836072)
    XCTAssertEqual(animation.timingAt(value: 284.31306189738245), 0.12478092602978305)
    XCTAssertEqual(animation.timingAt(value: 290.97699741147824), 0.14381945731075155)
    XCTAssertEqual(animation.timingAt(value: 291.0), 0.14434649124006554)
  }

  func testValueAtPerformance() throws {
    measure(metrics: [XCTCPUMetric(), XCTClockMetric()], options: options) {
      for time in stride(from: 0.0, through: TimingAnimationPerformanceTest.duration, by: 0.000002) {
        _ = animation.valueAt(time: time)
      }
    }
  }

  func testTimingAtPerformance() throws {
    measure(metrics: [XCTCPUMetric(), XCTClockMetric()], options: options) {
      for value in stride(
        from: TimingAnimationPerformanceTest.fromValue,
        through: TimingAnimationPerformanceTest.toValue,
        by: 0.001
      ) {
        _ = animation.timingAt(value: value)
      }
    }
  }
}
