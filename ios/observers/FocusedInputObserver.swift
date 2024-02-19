//
//  FocusedInputObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 05/10/2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import UIKit

let noFocusedInputEvent: [String: Any] = [
  "target": -1,
  "parentScrollViewTarget": -1,
  "layout": [
    "absoluteX": 0,
    "absoluteY": 0,
    "width": 0,
    "height": 0,
    "x": 0,
    "y": 0,
  ],
]

@objc(FocusedInputObserver)
public class FocusedInputObserver: NSObject {
  // class members
  var onLayoutChangedHandler: (NSDictionary) -> Void
  var onTextChangedHandler: (String) -> Void
  var onFocusDidSet: (NSDictionary) -> Void
  // state variables
  private var isMounted = false
  // input tracking
  private var currentInput: UIView?
  private var hasObservers = false
  private var lastEventDispatched: [AnyHashable: Any] = noFocusedInputEvent
  // observers
  private let textChangeObserver = TextChangeObserver()

  @objc public init(
    onLayoutChangedHandler: @escaping (NSDictionary) -> Void,
    onTextChangedHandler: @escaping (String) -> Void,
    onFocusDidSet: @escaping (NSDictionary) -> Void
  ) {
    self.onLayoutChangedHandler = onLayoutChangedHandler
    self.onTextChangedHandler = onTextChangedHandler
    self.onFocusDidSet = onFocusDidSet
  }

  @objc public func mount() {
    if isMounted {
      return
    }

    isMounted = true

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
    isMounted = false
    // swiftlint:disable:next notification_center_detachment
    NotificationCenter.default.removeObserver(self)
  }

  @objc func keyboardWillShow(_: Notification) {
    removeObservers()
    let responder = UIResponder.current as? UIView
    currentInput = responder?.superview as UIView?

    setupObservers()
    syncUpLayout()

    FocusedInputHolder.shared.set(responder as? TextInput)

    let allInputFields = ViewHierarchyNavigator.getAllInputFields()
    let currentIndex = allInputFields.firstIndex(where: { $0 as? UIView == responder }) ?? -1

    onFocusDidSet([
      "current": currentIndex,
      "count": allInputFields.count,
    ])
  }

  @objc func keyboardWillHide(_: Notification) {
    removeObservers()
    currentInput = nil
    dispatchEventToJS(data: noFocusedInputEvent)
  }

  @objc func syncUpLayout() {
    let responder = UIResponder.current
    let focusedInput = (responder as? UIView)?.superview
    let globalFrame = focusedInput?.globalFrame

    let data: [String: Any] = [
      "target": responder.reactViewTag,
      "parentScrollViewTarget": responder.parentScrollViewTarget,
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

  private func onTextChanged(text: String?) {
    syncUpLayout()

    if let string = text {
      onTextChangedHandler(string)
    }
  }

  private func dispatchEventToJS(data: [String: Any]) {
    if NSDictionary(dictionary: data).isEqual(to: lastEventDispatched) {
      return
    }

    lastEventDispatched = data
    onLayoutChangedHandler(data as NSDictionary)
  }

  private func setupObservers() {
    if hasObservers {
      return
    }

    if currentInput != nil {
      hasObservers = true
      currentInput?.addObserver(self, forKeyPath: "center", options: .new, context: nil)
      textChangeObserver.observeTextChanges(for: UIResponder.current, handler: onTextChanged)
    }
  }

  private func removeObservers() {
    if !hasObservers {
      return
    }

    hasObservers = false
    currentInput?.removeObserver(self, forKeyPath: "center", context: nil)
    textChangeObserver.removeObserver()
  }

  // swiftlint:disable:next block_based_kvo
  @objc override public func observeValue(
    forKeyPath keyPath: String?,
    of object: Any?,
    change _: [NSKeyValueChangeKey: Any]?,
    context _: UnsafeMutableRawPointer?
  ) {
    if keyPath == "center", object as? NSObject == currentInput {
      // we need to read layout in next frame, otherwise we'll get old
      // layout values
      DispatchQueue.main.async {
        self.syncUpLayout()
      }
    }
  }
}
