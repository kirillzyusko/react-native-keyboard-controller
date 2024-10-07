//
//  KeyboardAnimation.swift
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 04/05/2024.
//

import Foundation

protocol KeyboardAnimationProtocol {
  var startTime: CFTimeInterval { get }
  var diff: Double { get }
  var isIncreasing: Bool { get }

  func valueAt(time: Double) -> Double
  func timingAt(value: Double) -> Double
  func deriative(t: Double, x0: Double) -> Double
}

public class KeyboardAnimation: KeyboardAnimationProtocol {
  weak var animation: CAMediaTiming?

  // constructor variables
  let fromValue: Double
  let toValue: Double
  let speed: Float
  let timestamp: CFTimeInterval

  init(fromValue: Double, toValue: Double, animation: CAMediaTiming) {
    self.fromValue = fromValue
    self.toValue = toValue
    self.animation = animation
    speed = animation.speed
    timestamp = CACurrentMediaTime()
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

  func valueAt(time _: Double) -> Double {
    fatalError("Method is not implemented in abstract class!")
  }
    
    func deriative(t _: Double, x0 _: Double) -> Double {
        fatalError("Method is not implemented in abstract class!")
    }

  func timingAt(value: Double) -> Double {
    var lowerBound = 0.0
    var upperBound = 1.0 // Assuming 1 second is the max duration for simplicity
    let tolerance = 0.00001 // Define how precise you want to be
    var tGuess = 0.0

    // Check the direction of the animation
    let isIncreasing = isIncreasing

    while (upperBound - lowerBound) > tolerance {
      tGuess = (lowerBound + upperBound) / 2
      let currentValue = valueAt(time: tGuess / Double(speed))

      // Adjust the condition to account for the direction of animation
      if (currentValue < value && isIncreasing) || (currentValue > value && !isIncreasing) {
        lowerBound = tGuess
      } else {
        upperBound = tGuess
      }
    }

    return tGuess / Double(speed)
  }
    
  func inverse(value: Double) -> Double {
      let x0 = toValue - fromValue
              let epsilon = 1e-6
              let maxIterations = 100
      // TODO: duration / 2
              var t = 0.25 // Initial guess
      
      for _ in 0..<maxIterations {
          
          // Derivative computation
          let dy_dt = deriative(t: t, x0: x0)
          
          if abs(dy_dt) < epsilon {
              break // Avoid division by zero
          }
          
          var t_new = t - valueAt(time: t) / dy_dt
          
          // Ensure t_new stays positive
          if t_new < 0 {
              t_new = t / 2
          }
          
          if abs(t_new - t) < epsilon {
              t = t_new
              break
          }
          
          t = t_new
      }
      
      return t / Double(speed)
  }
}
