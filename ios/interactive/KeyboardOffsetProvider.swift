//
//  KeyboardOffsetProvider.swift
//  Pods
//
//  Created by Kiryl Ziusko on 01/11/2024.
//

import Foundation

@objc(KeyboardOffsetProvider)
public class KeyboardOffsetProvider: NSObject {
  @objc public static let shared = KeyboardOffsetProvider()

  override private init() {}

  private var offsetMap: [String: NSNumber] = [:]

  @objc public func setOffset(forTextInputNativeID nativeID: String, offset: NSNumber) {
    KeyboardAreaExtender.shared.updateHeight(to: CGFloat(offset), for: nativeID)
    offsetMap[nativeID] = offset
  }

  @objc public func getOffset(forTextInputNativeID nativeID: String?) -> NSNumber? {
    guard let unwrappedNativeID = nativeID else { return nil }
    return offsetMap[unwrappedNativeID]
  }

  @objc public func hasOffset(forTextInputNativeID nativeID: String?) -> Bool {
    guard let unwrappedNativeID = nativeID else { return false }
    return offsetMap[unwrappedNativeID] != nil
  }

  @objc public func removeOffset(forTextInputNativeID nativeID: String) {
    offsetMap.removeValue(forKey: nativeID)
  }
}
