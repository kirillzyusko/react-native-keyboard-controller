//
//  SpringAnimationPerformanceTest.swift
//  KeyboardControllerNativeTests
//
//  Created by Kiryl Ziusko on 08/10/2024.
//

import XCTest

final class SpringAnimationPerformanceTest: XCTestCase {
  let options: XCTMeasureOptions = {
    let opts = XCTMeasureOptions()
    opts.iterationCount = 10
    return opts
  }()

  var criticallyDampedAnimation: SpringAnimation = {
    let caSpringAnimation = CASpringAnimation()
    caSpringAnimation.damping = 500
    caSpringAnimation.stiffness = 1000
    caSpringAnimation.mass = 3
    caSpringAnimation.initialVelocity = 0
    return SpringAnimation(animation: caSpringAnimation, fromValue: 0, toValue: 336)
  }()

  func testCriticallyDampedValueAt() throws {
    XCTAssertEqual(criticallyDampedAnimation.valueAt(time: 0.250), 316.52488444019065)
    XCTAssertEqual(criticallyDampedAnimation.valueAt(time: 0.125), 223.44512762669416)
    XCTAssertEqual(criticallyDampedAnimation.valueAt(time: 0.325), 329.82914080062113)
    XCTAssertEqual(criticallyDampedAnimation.valueAt(time: 0.500), 335.6307289072886)
    XCTAssertEqual(criticallyDampedAnimation.valueAt(time: 0.0), 0.0)
    XCTAssertEqual(criticallyDampedAnimation.valueAt(time: 0.080), 144.11039189726017)
  }

  func testCriticallyDampedTimingAt() throws {
    XCTAssertEqual(criticallyDampedAnimation.timingAt(value: 160), 0.08782196044921875)
    XCTAssertEqual(criticallyDampedAnimation.timingAt(value: 0), 7.62939453125e-06)
    XCTAssertEqual(criticallyDampedAnimation.timingAt(value: 316.52488444019065), 0.24999237060546875)
    XCTAssertEqual(criticallyDampedAnimation.timingAt(value: 329.82914080062113), 0.32500457763671875)
  }

  func testCriticallyDampedValueAtPerformance() throws {
    measure(metrics: [XCTCPUMetric(), XCTClockMetric()], options: options) {
      for time in stride(from: 0.0, through: 0.500, by: 0.00001) {
        _ = criticallyDampedAnimation.valueAt(time: time)
      }
    }
  }

  func testCriticallyDampedTimingAtPerformance() throws {
    measure(metrics: [XCTCPUMetric(), XCTClockMetric()], options: options) {
      for value in stride(from: 0.0, through: 336.0, by: 0.001) {
        _ = criticallyDampedAnimation.timingAt(value: value)
      }
    }
  }
}
