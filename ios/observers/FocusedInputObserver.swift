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
  private var observation: NSKeyValueObservation?
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
      selector: #selector(didReceiveFocus),
      name: UIResponder.keyboardWillShowNotification,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(didReceiveFocus),
      name: UITextField.textDidBeginEditingNotification,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(didReceiveFocus),
      name: UITextView.textDidBeginEditingNotification,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(didReceiveBlur),
      name: UITextField.textDidEndEditingNotification,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(didReceiveBlur),
      name: UITextView.textDidEndEditingNotification,
      object: nil
    )
  }

  @objc public func unmount() {
    isMounted = false
    // swiftlint:disable:next notification_center_detachment
    NotificationCenter.default.removeObserver(self)
  }

  @objc func didReceiveFocus(_: Notification) {
    if UIResponder.current == currentResponder {
      // focus was already handled by keyboard event
      return
    }

    onFocus()
  }

  @objc func didReceiveBlur(_: Notification) {
    // blur gets triggered on endEditing, so we check if no upcoming
    // didReceiveFocus events are coming to exclude `noFocusedInput`
    // event when user switches between inputs
    DispatchQueue.main.async {
      // check that it wasn't a switch between inputs
      if !(UIResponder.current is TextInput) {
        self.onBlur()
      }
    }
  }

  func onFocus() {
    guard let responder = UIResponder.current as? UIView else { return }
    removeObservers(newResponder: responder)
    currentResponder = responder
    currentInput = currentResponder?.superview as UIView?

    setupObservers()
    // dispatch onSelectionChange on focus
    if let textInput = responder as? UITextInput {
      updateSelectionPosition(textInput: textInput, sendEvent: onSelectionChange)
    }

    syncUpLayout()

    FocusedInputHolder.shared.set(currentResponder as? TextInput)

    let allInputFields = ViewHierarchyNavigator.getAllInputFields()
    let currentIndex = allInputFields.firstIndex(where: { $0 == currentResponder }) ?? -1

    onFocusDidSet([
      "current": currentIndex,
      "count": allInputFields.count,
    ])
  }

  func onBlur() {
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
    if observation != nil {
      return
    }

    if currentInput != nil {
      observation = currentInput?.observe(\.center, options: .new) { [weak self] view, change in
        guard let self = self else { return }
        self.onLayoutChange(view: view, change: change)
      }

      // Substitute a delegate in the next frame.
      // This is only applicable if the autoFocus prop is true.
      // Other libraries (e.g., decorator views) might mount *after* the
      // TextInput and inject their own delegates at that point.
      // If we substitute our delegate too early (e.g., during autoFocus), and later restore it when the keyboard hides,
      // we may accidentally overwrite a delegate injected by another library — breaking its logic.
      DispatchQueue.main.async {
        self.substituteDelegate(self.currentResponder)
      }
    }
  }

  private func removeObservers(newResponder: UIResponder?) {
    if newResponder == currentResponder || observation == nil {
      return
    }

    observation?.invalidate()
    observation = nil

    substituteDelegateBack(currentResponder)
  }

  private func substituteDelegate(_ input: UIResponder?) {
    if let textField = input as? UITextField {
      if !(textField.delegate is KCTextInputCompositeDelegate),
         delegate.canSubstituteTextFieldDelegate(delegate: textField.delegate)
      {
        delegate.setTextFieldDelegate(delegate: textField.delegate, textField: textField)
        textField.delegate = delegate
      }
    } else if let textView = input as? UITextView {
      if !(textView.delegate is KCTextInputCompositeDelegate) {
        delegate.setTextViewDelegate(delegate: textView.delegate)
        textView.setForceDelegate(delegate)
      }
    }
  }

  private func substituteDelegateBack(_ input: UIResponder?) {
    if let textField = input as? UITextField, let oldDelegate = delegate.activeDelegate as? UITextFieldDelegate {
      textField.delegate = oldDelegate
    } else if let textView = input as? UITextView, let oldDelegate = delegate.activeDelegate as? UITextViewDelegate {
      textView.setForceDelegate(oldDelegate)
    }
  }

  private func onLayoutChange(view _: UIView, change _: NSKeyValueObservedChange<CGPoint>) {
    // we need to read layout in next frame, otherwise we'll get old
    // layout values
    DispatchQueue.main.async {
      self.syncUpLayout()
    }
  }

  private func onSelectionChange(_ event: NSDictionary) {
    // Safely retrieve the event dictionary as a Swift dictionary
    guard let eventDict = event as? [String: Any] else {
      return
    }

    syncUpLayout()

    let target: [String: Any] = [
      "target": (currentResponder as UIResponder?).reactViewTag,
    ]

    let data = target.merging(eventDict) { _, new in new }

    onSelectionChangedHandler(data as NSDictionary)
  }
}
