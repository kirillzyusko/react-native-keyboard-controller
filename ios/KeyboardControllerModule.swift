//
//  KeyboardController.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 22.04.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit
import AVFoundation

@objc(KeyboardController)
class KeyboardController: RCTEventEmitter {
  public static var shared: KeyboardController?
    
  override class func requiresMainQueueSetup() -> Bool {
    return false
  }

  override init() {
    super.init()
    KeyboardController.shared = self
  }

  // Android stubs
  @objc func enable() {}
  @objc func setInputMode(_ mode: NSNumber!) {}
  @objc func setDefaultMode() {}
    
  @objc open override func supportedEvents() -> [String] {
    return [
        "KeyboardController::keyboardWillShow",
        "KeyboardController::keyboardDidShow",
        "KeyboardController::keyboardWillHide",
        "KeyboardController::keyboardDidHide"
    ]
  }
}
