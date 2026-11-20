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

extension NSObject {
  /// Returns `nil` for a property that an object doesn't have (without raising an exception).
  func value(forKeyIfExists key: String) -> Any? {
    return responds(to: NSSelectorFromString(key)) ? value(forKey: key) : nil
  }
}
