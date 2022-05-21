//
//  KeyboardController.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 22.04.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import AVFoundation
import Foundation
import UIKit

@objc(KeyboardController)
class KeyboardController: RCTEventEmitter {
  public static var shared: KeyboardController?
  private var hasListeners = false

  override class func requiresMainQueueSetup() -> Bool {
    return false
  }

  override init() {
    super.init()
    KeyboardController.shared = self
  }

  // Android stubs
  @objc func setInputMode(_: NSNumber!) {}
  @objc func setDefaultMode() {}

  @objc override open func supportedEvents() -> [String] {
    return [
      "KeyboardController::keyboardWillShow",
      "KeyboardController::keyboardDidShow",
      "KeyboardController::keyboardWillHide",
      "KeyboardController::keyboardDidHide",
    ]
  }

  @objc override open func startObserving() {
    hasListeners = true
  }

  @objc override open func stopObserving() {
    hasListeners = false
  }

  @objc override open func sendEvent(withName name: String!, body: Any!) {
    if hasListeners {
      super.sendEvent(withName: name, body: body)
    }
  }
}
