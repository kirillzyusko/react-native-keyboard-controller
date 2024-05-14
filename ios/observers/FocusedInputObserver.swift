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
  /// handlers
  var onLayoutChangedHandler: (NSDictionary) -> Void
  var onTextChangedHandler: (String) -> Void
  var onSelectionChangedHandler: (NSDictionary) -> Void
  var onFocusDidSet: (NSDictionary) -> Void
  /// delegates
  var delegate: KCTextInputCompositeDelegate
  // state variables
  private var isMounted = false
  // input tracking
  private var currentInput: UIView?
  private var currentResponder: UIView?
  private var hasObservers = false
  private var lastEventDispatched: [AnyHashable: Any] = noFocusedInputEvent

  @objc public init(
    onLayoutChangedHandler: @escaping (NSDictionary) -> Void,
    onTextChangedHandler: @escaping (String) -> Void,
    onSelectionChangedHandler: @escaping (NSDictionary) -> Void,
    onFocusDidSet: @escaping (NSDictionary) -> Void
  ) {
    self.onLayoutChangedHandler = onLayoutChangedHandler
    self.onTextChangedHandler = onTextChangedHandler
    self.onSelectionChangedHandler = onSelectionChangedHandler
    self.onFocusDidSet = onFocusDidSet

    // Temporary initialization of the delegate with an empty closure
    delegate = KCTextInputCompositeDelegate(onSelectionChange: { _ in }, onTextChange: { _ in })

    super.init()

    // Initialize the delegate
    delegate = KCTextInputCompositeDelegate(
      onSelectionChange: { [weak self] event in
        self?.onSelectionChange(event)
      },
      onTextChange: { [weak self] text in
        self?.onTextChanged(text: text)
      }
    )
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
    guard let responder = UIResponder.current as? UIView else { return }
    removeObservers(newResponder: responder)
    currentResponder = responder
    currentInput = currentResponder?.superview as UIView?

    setupObservers()
    syncUpLayout()

    FocusedInputHolder.shared.set(currentResponder as? TextInput)

    let allInputFields = ViewHierarchyNavigator.getAllInputFields()
    let currentIndex = allInputFields.firstIndex(where: { $0 as? UIView == currentResponder }) ?? -1

    onFocusDidSet([
      "current": currentIndex,
      "count": allInputFields.count,
    ])
  }

  @objc func keyboardWillHide(_: Notification) {
    removeObservers(newResponder: nil)
    currentInput = nil
    currentResponder = nil
    dispatchEventToJS(data: noFocusedInputEvent)
  }

  @objc func syncUpLayout() {
    let responder = currentResponder as UIResponder?
    let focusedInput = currentInput
    let globalFrame = focusedInput?.globalFrame

    guard let frame = globalFrame, let input = focusedInput else { return }

    let data: [String: Any] = [
      "target": responder.reactViewTag,
      "parentScrollViewTarget": responder.parentScrollViewTarget,
      "layout": [
        "absoluteX": frame.origin.x,
        "absoluteY": frame.origin.y,
        "width": input.frame.width,
        "height": input.frame.height,
        "x": input.frame.origin.x,
        "y": input.frame.origin.y,
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

      substituteDelegate(currentResponder)
    }
  }

  private func removeObservers(newResponder: UIResponder?) {
    if newResponder == currentResponder || !hasObservers {
      return
    }

    hasObservers = false
    currentInput?.removeObserver(self, forKeyPath: "center", context: nil)

    substituteDelegateBack(currentResponder)
  }

  private func substituteDelegate(_ input: UIResponder?) {
    if let textField = input as? UITextField {
      if !(textField.delegate is KCTextInputCompositeDelegate) {
        delegate.setTextFieldDelegate(delegate: textField.delegate)
        textField.delegate = delegate
      }
    } else if let textView = input as? UITextView {
      if !(textView.delegate is KCTextInputCompositeDelegate) {
        delegate.setTextViewDelegate(delegate: textView.delegate)
        (textView as? RCTUITextView)?.setForceDelegate(delegate)
      }
    }
  }

  private func substituteDelegateBack(_ input: UIResponder?) {
    if let textField = input as? UITextField {
      textField.delegate = delegate.activeDelegate as? UITextFieldDelegate
    } else if let textView = input as? UITextView {
      (textView as? RCTUITextView)?.setForceDelegate(delegate.activeDelegate as? UITextViewDelegate)
    }
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

  private func onSelectionChange(_ event: NSDictionary) {
    // Safely retrieve the event dictionary as a Swift dictionary
    guard let eventDict = event as? [String: Any] else {
      return
    }

    let target: [String: Any] = [
      "target": (currentResponder as UIResponder?).reactViewTag,
    ]

    let data = target.merging(eventDict) { _, new in new }

    onSelectionChangedHandler(data as NSDictionary)
  }
}
