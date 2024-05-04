//
//  TimingAnimation.swift
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 02/05/2024.
//

import Foundation
import QuartzCore

public class TimingAnimation : KeyboardAnimation {
    private let p0: CGPoint
    private let p1: CGPoint
    private let p2: CGPoint
    private let p3: CGPoint
    
    init(animation: CABasicAnimation, fromValue: Double, toValue: Double) {
        let timingFunction = animation.timingFunction
        var controlPoints: [Float] = [0, 0, 0, 0]
        timingFunction?.getControlPoint(at: 1, values: &controlPoints[0])
        timingFunction?.getControlPoint(at: 2, values: &controlPoints[2])
        let p1 = CGPoint(x: CGFloat(controlPoints[0]), y: CGFloat(controlPoints[1]))
        let p2 = CGPoint(x: CGFloat(controlPoints[2]), y: CGFloat(controlPoints[3]))
        
        self.p0 = CGPoint(x: 0.0, y: 0.0)
        self.p1 = p1
        self.p2 = p2
        self.p3 = CGPoint(x: 1.0, y: 1.0)

      super.init(fromValue: fromValue, toValue: toValue, animation: animation)
    }

    func bezier(t: CGFloat) -> CGFloat {
        let u = 1 - t
        let tt = t * t
        let uu = u * u

        // Calculate the terms for the Bézier curve
        let term0 = uu * u * p0.y           // Since P0 = (0,0), term0 contributes 0
        let term1 = 3 * uu * t * p1.y       // Since P1.y = 0
        let term2 = 3 * u * tt * p2.y     // Since P2.y = 1.0
        let term3 = tt * t * p3.y           // Since P3.y = 1, term3 = t^3

        // Sum all terms to get the Bézier value
        return term0 + term1 + term2 + term3
    }

  // public functions
  override func valueAt(time: Double) -> Double {
      let x = time * Double(speed)
      let frames = ((animation?.duration ?? 0.0)) * Double(speed)
      let fraction = min((x / frames), 1)
      let t = findTForX(xTarget: fraction)
      
      let progress = bezier(t: t)
      
      print("ValueAt:: \(fraction) \(t) \(time) \(progress) \(animation?.duration). Bezier:: \(fromValue + (toValue - fromValue) * CGFloat(progress))")
      // print("from: \(fromValue) to: \(toValue) \(progress)")
      
      return fromValue + (toValue - fromValue) * CGFloat(progress)
  }
    
    func valueAt2(time: Double) -> Double {
        let x = time * Double(speed)
        let frames = ((animation?.duration ?? 0.0)) * Double(speed)
        let fraction = min((x / frames), 1)
        let t = findTForX(xTarget: fraction)
        
        let progress = bezier(t: t)
        
        // print("\(fromValue + (toValue - fromValue) * CGFloat(progress)) :: \(fraction) \(time) \(animation?.duration)")
        // print("from: \(fromValue) to: \(toValue) \(progress)")
        
        return fromValue + (toValue - fromValue) * CGFloat(progress)
    }
    
    func findTForX(xTarget: CGFloat, epsilon: CGFloat = 0.0001, maxIterations: Int = 100) -> CGFloat {
        var t: CGFloat = 0.5  // Start with an initial guess of t = 0.5
        for _ in 0..<maxIterations {
            let currentX = bezierX(t: t)  // Compute the x-coordinate at t
            let derivativeX = bezierXDerivative(t: t)  // Compute the derivative at t
            let xError = currentX - xTarget
            if abs(xError) < epsilon {
                return t
            }
            t -= xError / derivativeX  // Newton-Raphson step
            t = max(min(t, 1), 0)  // Ensure t stays within bounds
        }
        return t  // Return the approximation of t
    }

    func bezierX(t: CGFloat) -> CGFloat {
        // Implement this to compute the x-coordinate of the Bezier curve at t
        return (1 - t) * (1 - t) * (1 - t) * p0.x + 3 * (1 - t) * (1 - t) * t * p1.x + 3 * (1 - t) * t * t * p2.x + t * t * t * p3.x
    }

    func bezierXDerivative(t: CGFloat) -> CGFloat {
        // Implement this to compute the derivative of the x-coordinate of the Bezier curve at t
        return -3 * (1 - t) * (1 - t) * p0.x + (3 * (1 - t) * (1 - t) - 6 * t * (1 - t)) * p1.x + (6 * t * (1 - t) - 3 * t * t) * p2.x + 3 * t * t * p3.x
    }


  // temporarily override it because of valueAt2 usage
  override func timingAt(value y: Double) -> Double {
    var lowerBound = 0.0
    var upperBound = 1.0 // Assuming 1 second is the max duration for simplicity
    let tolerance = 0.00001 // Define how precise you want to be
    var tGuess = 0.0

    // Check the direction of the animation
    let isIncreasing = isIncreasing

    while (upperBound - lowerBound) > tolerance {
      tGuess = (lowerBound + upperBound) / 2
      let currentValue = valueAt2(time: tGuess / Double(speed))

      // Adjust the condition to account for the direction of animation
      if (currentValue < y && isIncreasing) || (currentValue > y && !isIncreasing) {
        lowerBound = tGuess
      } else {
        upperBound = tGuess
      }
    }

    return tGuess / Double(speed)
  }
}
