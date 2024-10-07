//
//  UIUtils.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 14/04/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation

class SpringAnimation2 {
    var zeta: Double
    var omega0: Double
    var omega1: Double
    var v0: Double
    var speed: Double
    var fromValue: Double
    var toValue: Double
    
    var stiffness: Double
    var damping: Double
    var mass: Double
    var initialVelocity: Double
    
    init(animation: (stiffness: Double, damping: Double, mass: Double, initialVelocity: Double), fromValue: Double, toValue: Double) {
        self.zeta = animation.damping / (2 * sqrt(animation.stiffness * animation.mass))
        self.omega0 = sqrt(animation.stiffness / animation.mass)
        self.omega1 = self.omega0 * sqrt(1.0 - self.zeta * self.zeta)
        self.v0 = -animation.initialVelocity
        self.speed = 1
        self.fromValue = fromValue
        self.toValue = toValue
        
        self.stiffness = animation.stiffness
        self.damping = animation.damping
        self.mass = animation.mass
        self.initialVelocity = animation.initialVelocity
    }
    
    func valueAt(time: Double) -> Double {
        let t = time * speed
        let x0 = toValue - fromValue
        var y: Double
        
        if zeta < 1 {
            // Under damped
            let envelope = exp(-zeta * omega0 * t)
            let A = (v0 + zeta * omega0 * x0) / omega1
            y = toValue - envelope * (A * sin(omega1 * t) + x0 * cos(omega1 * t))
        } else {
            // Critically damped
            let envelope = exp(-omega0 * t)
            y = toValue - envelope * (x0 + (v0 + omega0 * x0) * t)
        }
        
        return y
    }
    
    func inverseValueAt(y: Double) -> Double {
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
        
        return t / speed
    }
    
    func timingAt(value: Double) -> Double {
        var lowerBound = 0.0
        var upperBound = 1.0 // Assuming 1 second is the max duration for simplicity
        let tolerance = 0.00001 // Define how precise you want to be
        var tGuess = 0.0
        
        // Check the direction of the animation
        let isIncreasing = fromValue < toValue
        
        while (upperBound - lowerBound) > tolerance {
            tGuess = (lowerBound + upperBound) / 2
            let currentValue = valueAt(time: tGuess / speed)
            
            // Adjust the condition to account for the direction of animation
            if (currentValue < value && isIncreasing) || (currentValue > value && !isIncreasing) {
                lowerBound = tGuess
            } else {
                upperBound = tGuess
            }
        }
        
        return tGuess / speed
    }
}

func f() -> Int {
    // Usage Example
    let a = SpringAnimation2(animation: (stiffness: 1000, damping: 500, mass: 3, initialVelocity: 0), fromValue: 0, toValue: 336)
    
    var s = Date()
    print(a.valueAt(time: 0.29166))
    
    s = Date()
    var v1 = a.timingAt(value: 272.92713311637664)
    var t1 = Date().timeIntervalSince(s)
    
    s = Date()
    var v2 = a.inverseValueAt(y: 272.92713311637664)
    var t2 = Date().timeIntervalSince(s)
    
    print(t1 / t2)
    
    s = Date()
    v1 = a.timingAt(value: 331.8331704396089)
    t1 = Date().timeIntervalSince(s)
    
    s = Date()
    v2 = a.inverseValueAt(y: 331.8331704396089)
    t2 = Date().timeIntervalSince(s)
    
    print(t1 / t2)
    
    s = Date()
    v1 = a.timingAt(value: 325.65342071220124)
    t1 = Date().timeIntervalSince(s)
    
    s = Date()
    v2 = a.inverseValueAt(y: 325.65342071220124)
    t2 = Date().timeIntervalSince(s)
    
    print(t1 / t2)
    
    s = Date()
    v1 = a.timingAt(value: 272.92713311637664)
    t1 = Date().timeIntervalSince(s)
    
    s = Date()
    v2 = a.inverseValueAt(y: 272.92713311637664)
    t2 = Date().timeIntervalSince(s)
    
    print(t1 / t2)
    
    s = Date()
    v1 = a.timingAt(value: 150.58459)
    t1 = Date().timeIntervalSince(s)
    
    s = Date()
    v2 = a.inverseValueAt(y: 150.58459)
    t2 = Date().timeIntervalSince(s)
    
    print(t1 / t2)
    
    return 0
}

enum UIUtils {
  static let nextFrame = 1.0 / 60
    static let a = f()
}
