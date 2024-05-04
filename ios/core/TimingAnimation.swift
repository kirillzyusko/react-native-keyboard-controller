//
//  TimingAnimation.swift
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 02/05/2024.
//

import Foundation
import QuartzCore

public class TimingAnimation : KeyboardAnimation {
  private weak var animation: CABasicAnimation?

    private let p0: CGPoint
    private let p1: CGPoint
  private let fromValue: Double
  private let toValue: Double
  private let speed: Float
  private let timestamp: CFTimeInterval

  init(
    p0: CGPoint,
    p1: CGPoint,
    speed: Float,
    fromValue: Double,
    toValue: Double
  ) {
      self.p0 = p0
      self.p1 = p1
    self.speed = speed
    self.fromValue = fromValue
    self.toValue = toValue
    timestamp = CACurrentMediaTime()
      print("\(self.toValue) \(self.p0) \(self.p1)")
  }

  convenience init(animation: CABasicAnimation, fromValue: Double, toValue: Double) {
      let timingFunction = animation.timingFunction
      var controlPoints: [Float] = [0, 0, 0, 0]
      timingFunction?.getControlPoint(at: 1, values: &controlPoints[0])
      timingFunction?.getControlPoint(at: 2, values: &controlPoints[2])
      let p0 = CGPoint(x: CGFloat(controlPoints[0]), y: CGFloat(controlPoints[1]))
      let p1 = CGPoint(x: CGFloat(controlPoints[2]), y: CGFloat(controlPoints[3]))
    self.init(
      p0: p0,
      p1: p1,
      speed: (animation as CABasicAnimation).speed,
      fromValue: fromValue,
      toValue: toValue
    )
    self.animation = animation
  }

    func bezier(t: CGFloat) -> CGFloat {
        let u = 1 - t
        let tt = t * t
        let uu = u * u

        // Calculate the terms for the Bézier curve
        let term0 = uu * u * 0           // Since P0 = (0,0), term0 contributes 0
        let term1 = 3 * uu * t * 0       // Since P1.y = 0
        let term2 = 3 * u * tt * 1.0     // Since P2.y = 1.0
        let term3 = tt * t * 1           // Since P3.y = 1, term3 = t^3

        // Sum all terms to get the Bézier value
        return term0 + term1 + term2 + term3
    }

  // public getters
  var startTime: CFTimeInterval {
    // when concurrent animation happens, then `.beginTime` remains the same
    return max(animation?.beginTime ?? timestamp, timestamp)
  }

  var diff: Double {
    return ((animation?.beginTime ?? timestamp) - timestamp).truncatingRemainder(dividingBy: UIUtils.nextFrame)
  }

  var isIncreasing: Bool {
    return fromValue < toValue
  }

  // public functions
  func valueAt(time: Double) -> Double {
      let t = time * Double(speed)
      let fraction = min(t / ((animation?.duration ?? 0.25) * Double(speed)), 1)
      
      let progress = bezier(t: fraction)
      
      print("ValueAt:: \(fraction) \(time) \(progress) \(animation?.duration). Bezier:: \(fromValue + (toValue - fromValue) * CGFloat(progress))")
      // print("from: \(fromValue) to: \(toValue) \(progress)")
      
      return fromValue + (toValue - fromValue) * CGFloat(progress)
  }
    
    // (346 - 160) * x = 112
    // x (progress) = 0.60215053763
    
    func valueAt2(time: Double) -> Double {
        let t = time * Double(speed)
        let fraction = min(t / ((animation?.duration ?? 0.25) * Double(speed)), 1)
        
        let progress = bezier(t: fraction)
        
        // print("\(fromValue + (toValue - fromValue) * CGFloat(progress)) :: \(fraction) \(time) \(animation?.duration)")
        // print("from: \(fromValue) to: \(toValue) \(progress)")
        
        return fromValue + (toValue - fromValue) * CGFloat(progress)
    }

  func timingAt(value y: Double) -> Double {
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
