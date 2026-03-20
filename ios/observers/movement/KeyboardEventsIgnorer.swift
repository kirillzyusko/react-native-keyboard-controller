//
//  KeyboardEventsIgnorer.swift
//  Pods
//
//  Created by Kiryl Ziusko on 24/11/2024.
//

import Foundation

@objc(KeyboardEventsIgnorer)
public class KeyboardEventsIgnorer: NSObject {
  @objc public static let shared = KeyboardEventsIgnorer()

  var shouldIgnoreKeyboardEvents = false

  public var shouldIgnore: Bool {
    return shouldIgnoreKeyboardEvents
  }

  override init() {
    super.init()
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(handleIgnoreKeyboardEventsNotification),
      name: .shouldIgnoreKeyboardEvents,
      object: nil
    )
  }

  @objc private func handleIgnoreKeyboardEventsNotification(_ notification: Notification) {
    if let userInfo = notification.userInfo, let value = userInfo["ignore"] as? Bool {
      shouldIgnoreKeyboardEvents = value
    }
  }

  deinit {
    NotificationCenter.default.removeObserver(self)
  }
}
