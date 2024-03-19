//
//  SpringAnimation.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 18/03/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation
import QuartzCore

// swiftlint:disable identifier_name
public class SpringAnimation {
  private weak var animation: CASpringAnimation?

  // internal variables
  private var zeta: Double // Damping ratio
  private var omega0: Double // Undamped angular frequency of the oscillator
  private var omega1: Double // Exponential decay
  private var v0: Double // Initial velocity

  // constructor variables
  private let stiffness: Double
  private let damping: Double
  private let mass: Double
  private let initialVelocity: Double
  private let fromValue: Double
  private let toValue: Double

  // public members
  public let speed: Float

  init(
    stiffness: Double,
    damping: Double,
    mass: Double,
    initialVelocity: Double,
    speed: Float,
    fromValue: Double,
    toValue: Double
  ) {
    self.stiffness = stiffness
    self.damping = damping
    self.mass = mass
    self.initialVelocity = initialVelocity
    self.speed = speed
    self.fromValue = fromValue
    self.toValue = toValue

    zeta = damping / (2 * sqrt(stiffness * mass)) // Damping ratio
    omega0 = sqrt(stiffness / mass) // Undamped angular frequency of the oscillator
    omega1 = omega0 * sqrt(1.0 - zeta * zeta) // Exponential decay
    v0 = -initialVelocity
  }

  convenience init(animation: CASpringAnimation, fromValue: Double, toValue: Double) {
    self.init(
      stiffness: animation.stiffness,
      damping: animation.damping,
      mass: animation.mass,
      initialVelocity: animation.initialVelocity,
      speed: (animation as CABasicAnimation).speed,
      fromValue: fromValue,
      toValue: toValue
    )
    self.animation = animation
  }

  // public getters
  var beginTime: CFTimeInterval? {
    return animation?.beginTime
  }

  // public functions
  func valueAt(time: Double) -> Double {
    let t = time * Double(speed)
    let x0 = toValue - fromValue

    var y: Double
    if zeta < 1 {
      // Under damped
      let envelope = exp(-zeta * omega0 * t)
      y = toValue - envelope * (((v0 + zeta * omega0 * x0) / omega1) * sin(omega1 * t) + x0 * cos(omega1 * t))
    } else {
      // Critically damped
      let envelope = exp(-omega0 * t)
      y = toValue - envelope * (x0 + (v0 + omega0 * x0) * t)
    }

    return y
  }

  func timingAt(value y: Double) -> Double {
    var lowerBound = 0.0
    var upperBound = 1.0 // Assuming 1 second is the max duration for simplicity
    let tolerance = 0.001 // Define how precise you want to be
    var tGuess = 0.0

    while (upperBound - lowerBound) > tolerance {
      tGuess = ((lowerBound + upperBound) / 2) / Double(speed)
      let currentValue = valueAt(time: tGuess)

      if currentValue < y {
        lowerBound = tGuess
      } else {
        upperBound = tGuess
      }
    }

    return tGuess
  }
}

// swiftlint:enable identifier_name
