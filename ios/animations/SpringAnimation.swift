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
public final class SpringAnimation: KeyboardAnimation {
  // internal variables
  private let zeta: Double // Damping ratio
  private let omega0: Double // Undamped angular frequency of the oscillator
  private let omega1: Double // Exponential decay
  private let v0: Double // Initial velocity
  // pre-computed values
  private let x0: Double
  private let A_under: Double
  private let B_under: Double
  private let A_crit: Double
  private let B_crit: Double

  // constructor variables
  private let stiffness: Double
  private let damping: Double
  private let mass: Double
  private let initialVelocity: Double

  init(animation: CASpringAnimation, fromValue: Double, toValue: Double) {
    stiffness = animation.stiffness
    damping = animation.damping
    mass = animation.mass
    initialVelocity = animation.initialVelocity

    zeta = damping / (2 * sqrt(stiffness * mass)) // Damping ratio
    omega0 = sqrt(stiffness / mass) // Undamped angular frequency of the oscillator
    omega1 = omega0 * sqrt(1.0 - zeta * zeta) // Exponential decay
    v0 = -initialVelocity
    x0 = toValue - fromValue

    if zeta < 1 {
      A_crit = 0
      B_crit = 0
      A_under = (v0 + zeta * omega0 * x0) / omega1
      B_under = x0
    } else {
      A_crit = x0
      B_crit = (v0 + omega0 * x0)
      A_under = 0
      B_under = 0
    }

    super.init(fromValue: fromValue, toValue: toValue, animation: animation)
  }

  // public functions
  override func valueAt(time: Double) -> Double {
    let t = time * Double(speed)

    var y: Double
    if zeta < 1 {
      let envelope = exp(-zeta * omega0 * t)
      let angle = omega1 * t
      let sinAngle = sin(angle)
      let cosAngle = cos(angle)
      y = toValue - envelope * (A_under * sinAngle + B_under * cosAngle)
    } else {
      let envelope = exp(-omega0 * t)
      y = toValue - envelope * (A_crit + B_crit * t)
    }

    return y
  }
}

// swiftlint:enable identifier_name
