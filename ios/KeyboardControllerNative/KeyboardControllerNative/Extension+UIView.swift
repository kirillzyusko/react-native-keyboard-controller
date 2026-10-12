//
//  Extension+UIView.swift
//  Tests
//
//  Created by Kiryl Ziusko on 21/02/2024.
//

import Foundation

// library sources get UIKit from the pod's umbrella header, so re-export it for them here
@_exported import UIKit

public extension UIView {
  var reactTag: NSNumber {
    return tag as NSNumber
  }

  var nativeID: String {
    return accessibilityIdentifier ?? ""
  }
}
