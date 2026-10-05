//
//  UIScrollView.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 04/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import React
import Foundation
import UIKit

public extension UIScrollView {
  var reactViewTag: NSNumber {
    #if KEYBOARD_CONTROLLER_NEW_ARCH_ENABLED
      return (superview?.tag ?? -1) as NSNumber
    #else
      return superview?.reactTag ?? -1
    #endif
  }
}
