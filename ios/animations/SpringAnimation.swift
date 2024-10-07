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

    super.init(fromValue: fromValue, toValue: toValue, animation: animation)
  }

  // public functions
  override func valueAt(time: Double) -> Double {
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
}

// swiftlint:enable identifier_name
