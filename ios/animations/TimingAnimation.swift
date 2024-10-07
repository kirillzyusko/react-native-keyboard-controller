//
//  TimingAnimation.swift
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 02/05/2024.
//

import Foundation
import QuartzCore

// swiftlint:disable identifier_name
/**
 * A class that handles timing animations using Bézier curves.
 *
 * This class calculates the progress of animations based on Bézier curve control points.
 * For more details on the Bézier curves, see [Desmos Graph](https://www.desmos.com/calculator/eynenh1aga?lang=en).
 */
public final class TimingAnimation: KeyboardAnimation {
  private let p1: CGPoint
  private let p2: CGPoint

  init(animation: CABasicAnimation, fromValue: Double, toValue: Double) {
    let timingFunction = animation.timingFunction
    var controlPoints: ContiguousArray<Float> = ContiguousArray([0, 0, 0, 0])
    timingFunction?.getControlPoint(at: 1, values: &controlPoints[0])
    timingFunction?.getControlPoint(at: 2, values: &controlPoints[2])
    let p1 = CGPoint(x: CGFloat(controlPoints[0]), y: CGFloat(controlPoints[1]))
    let p2 = CGPoint(x: CGFloat(controlPoints[2]), y: CGFloat(controlPoints[3]))

    self.p1 = p1
    self.p2 = p2

    super.init(fromValue: fromValue, toValue: toValue, animation: animation)
  }

  // public functions
  override func valueAt(time: Double) -> Double {
    let x = time * Double(speed)
    let frames = (animation?.duration ?? 0.0) * Double(speed)
    let fraction = min(x / frames, 1)
    let t = findTForX(xTarget: fraction)

    let progress = bezierY(t: t)

    return fromValue + (toValue - fromValue) * CGFloat(progress)
  }

  // private functions
  private func bezier(t: CGFloat, valueForPoint: (CGPoint) -> CGFloat) -> CGFloat {
    let u = 1 - t
    let tt = t * t
    let uu = u * u

    // Calculate the terms for the Bézier curve
    // term0 is evaluated as `0`, because P0(0, 0)
    // let term0 = uu * u * valueForPoint(p0) // P0
    let term1 = 3 * uu * t * valueForPoint(p1) // P1
    let term2 = 3 * u * tt * valueForPoint(p2) // P2
    let term3 = tt * t // * valueForPoint(p3), because P3(1, 1)

    // Sum all terms to get the Bézier value
    return term1 + term2 + term3
  }

  private func bezierY(t: CGFloat) -> CGFloat {
    return bezier(t: t) { $0.y }
  }

  private func bezierX(t: CGFloat) -> CGFloat {
    return bezier(t: t) { $0.x }
  }

  private func findTForX(xTarget: CGFloat, epsilon: CGFloat = 0.0001, maxIterations: Int = 100) -> CGFloat {
    var t: CGFloat = 0.5 // Start with an initial guess of t = 0.5
    for _ in 0 ..< maxIterations {
      let currentX = bezierX(t: t) // Compute the x-coordinate at t
      let derivativeX = bezierXDerivative(t: t) // Compute the derivative at t
      let xError = currentX - xTarget
      if abs(xError) < epsilon {
        return t
      }
      t -= xError / derivativeX // Newton-Raphson step
      t = max(min(t, 1), 0) // Ensure t stays within bounds
    }
    return t // Return the approximation of t
  }

  private func bezierDerivative(t: CGFloat, valueForPoint: (CGPoint) -> CGFloat) -> CGFloat {
    let u = 1 - t
    let uu = u * u
    let tt = t * t
    let tu = t * u

    // term0 is evaluated as `0`, because P0(0, 0)
    // let term0 = -3 * uu * valueForPoint(p0)
    let term1 = (3 * uu - 6 * tu) * valueForPoint(p1)
    let term2 = (6 * tu - 3 * tt) * valueForPoint(p2)
    let term3 = 3 * tt // * valueForPoint(p3), because P3(1, 1)

    // Sum all terms to get the derivative
    return term1 + term2 + term3
  }

  private func bezierXDerivative(t: CGFloat) -> CGFloat {
    return bezierDerivative(t: t) { $0.x }
  }
}

// swiftlint:enable identifier_name
