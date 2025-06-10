//
//  String.swift
//  Pods
//
//  Created by Kiryl Ziusko on 10/06/2025.
//

public extension String {
  /// `"<foo".hasAnyPrefix(["<bar", "<foo"])` → true
  func hasAnyPrefix(_ prefixes: [String]) -> Bool {
    prefixes.contains { hasPrefix($0) }
  }
}
