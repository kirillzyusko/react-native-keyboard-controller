//
//  KeyboardAreaExtender.swift
//  Pods
//
//  Created by Kiryl Ziusko on 02/11/2024.
//

class KeyboardAreaExtender: NSObject {
  private var currentInputAccessoryView: InvisibleInputAccessoryView?
  private var lastOffset: CGFloat = 0

  @objc public static let shared = KeyboardAreaExtender()

  override private init() {
    super.init()
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardDidAppear),
      name: UIResponder.keyboardDidShowNotification,
      object: nil
    )
  }

  deinit {
    NotificationCenter.default.removeObserver(self)
  }

  public var offset: CGFloat {
    if !isVisible {
      return lastOffset
    }

    return currentInputAccessoryView?.frame.height ?? 0
  }

  public func hide() {
    if isVisible {
      print("hide iav")
      NotificationCenter.default.post(
        name: .shouldIgnoreKeyboardEvents, object: nil, userInfo: ["ignore": true]
      )
      lastOffset = offset
      currentInputAccessoryView?.hide()
    }
  }

  public func remove() {
    print("remove KeyboardAreaExtender")
    lastOffset = 0
    currentInputAccessoryView = nil
  }

  public func updateHeight(_ to: CGFloat, _ nativeID: String) {
    if UIResponder.current.nativeID == nativeID {
      currentInputAccessoryView?.updateHeight(to: to)
    }
  }

  private var isVisible: Bool {
    return currentInputAccessoryView?.isShown ?? false
  }

  @objc private func keyboardDidAppear(_: Notification) {
    print("KEA - keyboardDidAppear \(Date.currentTimeStamp)")
    let responder = UIResponder.current
    if let activeTextInput = responder as? TextInput,
       let offset = KeyboardOffsetProvider.shared.getOffset(
         forTextInputNativeID: responder.nativeID),
       responder?.inputAccessoryView == nil
    {
      currentInputAccessoryView = InvisibleInputAccessoryView(height: CGFloat(truncating: offset))

      activeTextInput.inputAccessoryView = currentInputAccessoryView
      activeTextInput.reloadInputViews()

      NotificationCenter.default.post(
        name: .shouldIgnoreKeyboardEvents, object: nil, userInfo: ["ignore": true]
      )

      print("Attaching `inputAccessoryView` \(Date.currentTimeStamp)")
    }
  }
}
