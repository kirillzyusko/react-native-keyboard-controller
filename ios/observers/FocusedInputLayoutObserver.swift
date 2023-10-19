//
//  FocusedInputLayoutObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 05/10/2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import UIKit

let noFocusedInputEvent: [String: Any] = [
  "target": -1,
  "layout": [
    "absoluteX": 0,
    "absoluteY": 0,
    "width": 0,
    "height": 0,
    "x": 0,
    "y": 0,
  ],
]

@objc(FocusedInputLayoutObserver)
public class FocusedInputLayoutObserver: NSObject {
  // class members
  var onEvent: (NSDictionary) -> Void
  // input tracking
  private var currentInput: UIView?
  private var hasKVObserver = false
  private var lastEventDispatched: [AnyHashable: Any] = noFocusedInputEvent

  @objc public init(
    handler: @escaping (NSDictionary) -> Void
  ) {
    onEvent = handler
  }

  @objc public func mount() {
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardWillShow),
      name: UIResponder.keyboardWillShowNotification,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardWillHide),
      name: UIResponder.keyboardWillHideNotification,
      object: nil
    )
  }

  @objc public func unmount() {
    // swiftlint:disable:next notification_center_detachment
    NotificationCenter.default.removeObserver(self)
  }

  @objc func keyboardWillShow(_: Notification) {
    removeKVObserver()
    currentInput = (UIResponder.current as? UIView)?.superview as UIView?
    setupKVObserver()
    syncUpLayout()
  }

  @objc func keyboardWillHide(_: Notification) {
    removeKVObserver()
    dispatchEventToJS(data: noFocusedInputEvent)
  }

  @objc func syncUpLayout() {
    let responder = UIResponder.current
    // TODO: to get a real tag/layout need to use a superview - maybe return UIResponder.current as superview?
    let focusedInput = (responder as? UIView)?.superview
    let globalFrame = focusedInput?.globalFrame

    let data: [String: Any] = [
      "target": responder.reactViewTag,
      "layout": [
        "absoluteX": globalFrame?.origin.x,
        "absoluteY": globalFrame?.origin.y,
        "width": focusedInput?.frame.width,
        "height": focusedInput?.frame.height,
        "x": focusedInput?.frame.origin.x,
        "y": focusedInput?.frame.origin.y,
      ],
    ]

    dispatchEventToJS(data: data)
  }

  private func dispatchEventToJS(data: [String: Any]) {
    if NSDictionary(dictionary: data).isEqual(to: lastEventDispatched) {
      return
    }

    lastEventDispatched = data
    onEvent(data as NSDictionary)
  }

  private func setupKVObserver() {
    if hasKVObserver {
      return
    }

    if currentInput != nil {
      hasKVObserver = true
      currentInput?.addObserver(self, forKeyPath: "center", options: .new, context: nil)
    }
  }

  private func removeKVObserver() {
    if !hasKVObserver {
      return
    }

    hasKVObserver = false
    currentInput?.removeObserver(self, forKeyPath: "center", context: nil)
  }

  // swiftlint:disable:next block_based_kvo
  @objc override public func observeValue(
    forKeyPath keyPath: String?,
    of object: Any?,
    change _: [NSKeyValueChangeKey: Any]?,
    context _: UnsafeMutableRawPointer?
  ) {
    // swiftlint:disable:next force_cast
    if keyPath == "center", object as! NSObject == currentInput! {
      // we need to read layout in next frame, otherwise we'll get old
      // layout values
      DispatchQueue.main.async {
        print("KVObserver")
        self.syncUpLayout()
      }
    }
  }
}
