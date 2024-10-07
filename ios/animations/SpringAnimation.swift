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
    
    override func inverse(value y: Double) -> Double {
        let x0 = toValue - fromValue
               let epsilon = 1e-6
               let maxIterations = 100
               var t = 0.25 // Initial guess
               
               if zeta < 1 {
                   // Under damped
                   let A = (v0 + zeta * omega0 * x0) / omega1
                   let a = zeta * omega0
                   let b = omega1
                   
                   for _ in 0..<maxIterations {
                       let envelope = exp(-a * t)
                       let sinTerm = sin(b * t)
                       let cosTerm = cos(b * t)
                       let S = A * sinTerm + x0 * cosTerm
                       let y_t = toValue - envelope * S - y
                       
                       // Derivative computation
                       let dSdt = A * b * cosTerm - x0 * b * sinTerm
                       let dy_dt = -(-a * envelope * S + envelope * dSdt)
                       
                       if abs(dy_dt) < epsilon {
                           break // Avoid division by zero
                       }
                       
                       let t_new = t - y_t / dy_dt
                       
                       if abs(t_new - t) < epsilon {
                           t = t_new
                           break
                       }
                       t = t_new
                   }
               } else {
                   // Critically damped (zeta >= 1)
                   let B = v0 + omega0 * x0
                   
                   for _ in 0..<maxIterations {
                       let envelope = exp(-omega0 * t)
                       let S = x0 + B * t
                       let y_t = toValue - envelope * S - y
                       
                       // Derivative computation
                       let dy_dt = omega0 * envelope * S - envelope * B
                       
                       if abs(dy_dt) < epsilon {
                           break // Avoid division by zero
                       }
                       
                       var t_new = t - y_t / dy_dt
                       
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
               }
               
        return t / Double(speed)
    }
}

// swiftlint:enable identifier_name
