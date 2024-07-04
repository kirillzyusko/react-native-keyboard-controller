//
//  Extensions.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 04/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation
import UIKit

public extension UIView {
  var globalFrame: CGRect? {
    let rootView = UIApplication.shared.keyWindow?.rootViewController?.view
    return superview?.convert(frame, to: rootView)
  }
}
