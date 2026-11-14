//
//  KeyboardAreaExtender.swift
//  Pods
//
//  Created by Kiryl Ziusko on 02/11/2024.
//

import UIKit

class KeyboardAreaExtender: NSObject {
  private var currentInputAccessoryView: InvisibleInputAccessoryView?
  private weak var keyboardLayoutGuideView: UIView?
  private var previousDismissPadding: CGFloat = 0

  @objc static let shared = KeyboardAreaExtender()

  override private init() {
    super.init()
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardDidAppear),
      name: .keyboardDidAppear,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(resetDismissPadding),
      name: UIResponder.keyboardDidHideNotification,
      object: nil
    )
  }

  deinit {
    NotificationCenter.default.removeObserver(self)
  }

  var offset: CGFloat {
    return currentInputAccessoryView?.frame.height ?? 0
  }

  func hide() {
    resetDismissPadding()
    if isVisible {
      NotificationCenter.default.post(
        name: .shouldIgnoreKeyboardEvents, object: nil, userInfo: ["ignore": true]
      )
      currentInputAccessoryView?.hide()
    }
  }

  func remove() {
    resetDismissPadding()
    currentInputAccessoryView = nil
  }

  func updateHeight(to newHeight: CGFloat, for nativeID: String) {
    let responder = UIResponder.current
    guard responder.nativeID == nativeID else { return }

    if #available(iOS 26.0, *) {
      guard let activeTextInput = responder as? TextInput,
            activeTextInput.inputAccessoryView == nil,
            let view = UIApplication.topViewController()?.view
      else {
        resetDismissPadding()
        return
      }

      if keyboardLayoutGuideView !== view {
        resetDismissPadding()
        keyboardLayoutGuideView = view
        previousDismissPadding = view.keyboardLayoutGuide.keyboardDismissPadding
      }
      // Extend the gesture without changing the keyboard frame with a synthetic accessory.
      view.keyboardLayoutGuide.keyboardDismissPadding = newHeight
    } else {
      currentInputAccessoryView?.updateHeight(to: newHeight)
    }
  }

  private var isVisible: Bool {
    return currentInputAccessoryView?.isShown ?? false
  }

  @objc private func keyboardDidAppear(_: Notification) {
    let responder = UIResponder.current
    if #available(iOS 26.0, *) {
      if let nativeID = responder.nativeID,
         let offset = KeyboardOffsetProvider.shared.getOffset(forTextInputNativeID: nativeID)
      {
        updateHeight(to: CGFloat(truncating: offset), for: nativeID)
      } else {
        resetDismissPadding()
      }
      return
    }

    if let activeTextInput = responder as? TextInput,
       let offset = KeyboardOffsetProvider.shared.getOffset(
         forTextInputNativeID: responder.nativeID
       ),
       responder?.inputAccessoryView == nil
    {
      currentInputAccessoryView = InvisibleInputAccessoryView(height: CGFloat(truncating: offset))

      // we need to send this event before we actually attach the IAV
      // since on some OS versions (iOS 15 for example), `reloadInputViews`
      // will trigger `keyboardDidAppear` listener immediately
      NotificationCenter.default.post(
        name: .shouldIgnoreKeyboardEvents, object: nil, userInfo: ["ignore": true]
      )

      activeTextInput.inputAccessoryView = currentInputAccessoryView
      activeTextInput.reloadInputViews()
    }
  }

  @objc private func resetDismissPadding() {
    if #available(iOS 26.0, *) {
      keyboardLayoutGuideView?.keyboardLayoutGuide.keyboardDismissPadding = previousDismissPadding
    }
    keyboardLayoutGuideView = nil
  }
}
