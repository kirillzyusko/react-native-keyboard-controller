//
//  SpringAnimationPerformanceTest.swift
//  KeyboardControllerNativeTests
//
//  Created by Kiryl Ziusko on 08/10/2024.
//

import XCTest

final class SpringAnimationPerformanceTest: XCTestCase {
    let caSpringAnimation = CASpringAnimation()
    var animation: SpringAnimation? = nil

    override func setUpWithError() throws {
        caSpringAnimation.damping = 500
        caSpringAnimation.stiffness = 1000
        caSpringAnimation.mass = 3
        caSpringAnimation.initialVelocity = 0
        
        animation = SpringAnimation(animation: caSpringAnimation, fromValue: 0, toValue: 336)
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testValueAt() throws {
        XCTAssertEqual(animation?.valueAt(time: 0.250), 316.52488444019065)
        XCTAssertEqual(animation?.valueAt(time: 0.125), 223.44512762669416)
        XCTAssertEqual(animation?.valueAt(time: 0.325), 329.82914080062113)
        XCTAssertEqual(animation?.valueAt(time: 0.500), 335.6307289072886)
        XCTAssertEqual(animation?.valueAt(time: 0.0), 0.0)
        XCTAssertEqual(animation?.valueAt(time: 0.080), 144.11039189726017)
    }
    
    func testTimingAt() throws {
        XCTAssertEqual(animation?.timingAt(value: 160), 0.08782196044921875)
        XCTAssertEqual(animation?.timingAt(value: 0), 7.62939453125e-06)
        XCTAssertEqual(animation?.timingAt(value: 316.52488444019065), 0.24999237060546875)
        XCTAssertEqual(animation?.timingAt(value: 329.82914080062113), 0.32500457763671875)
    }

    func testValueAtPerformance() throws {
        // This is an example of a performance test case.
        self.measure {
            for time in stride(from: 0.0, through: 0.500, by: 0.001) {
                let _ = animation?.valueAt(time: time)
            }
        }
    }
    
    func testTimingAtPerformance() throws {
        self.measure(metrics: [XCTCPUMetric()]) {
            for value in stride(from: 0.0, through: 336.0, by: 0.001) {
                let _ = animation?.timingAt(value: value)
            }
        }
    }

}
