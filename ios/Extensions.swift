//
//  Extensions.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 10/06/2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation

public extension CGFloat {
    static func interpolate(inputRange: [CGFloat], outputRange: [CGFloat], currentValue: CGFloat) -> CGFloat {
      let inputMin = inputRange.min() ?? 0
      let inputMax = inputRange.max() ?? 1
      let outputMin = outputRange.min() ?? 0
      let outputMax = outputRange.max() ?? 1

      let normalizedValue = (currentValue - inputMin) / (inputMax - inputMin)
      let interpolatedValue = outputMin + (outputMax - outputMin) * normalizedValue

      return interpolatedValue
    }
}
