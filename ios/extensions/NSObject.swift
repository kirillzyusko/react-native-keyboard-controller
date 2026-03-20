//
//  NSObject.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 26/10/2025.
//

public extension NSObject {
  func safeValue(forKey key: String) -> Any? {
    return _safeValue(forKey: key)
  }
}
