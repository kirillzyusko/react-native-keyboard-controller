//
//  UIScrollView.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 04/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation
import UIKit

public extension UIScrollView {
  var reactViewTag: NSNumber {
    return superview.reactNativeTag
  }
}
