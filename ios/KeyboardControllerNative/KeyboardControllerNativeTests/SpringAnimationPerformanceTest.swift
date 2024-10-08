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
    }

    func testValueAtPerformance() throws {
        // This is an example of a performance test case.
        self.measure {
            for time in stride(from: 0.0, through: 0.500, by: 0.001) {
                animation?.valueAt(time: time)
            }
        }
    }
    
    func testTimingAtPerformance() throws {
        self.measure {
            for value in stride(from: 0.0, through: 336.0, by: 0.001) {
                animation?.timingAt(value: value)
            }
        }
    }

}
