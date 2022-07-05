@objc(KeyboardControllerViewManager)
class KeyboardControllerViewManager: RCTViewManager {
  override class func requiresMainQueueSetup() -> Bool {
    return false
  }

  override func view() -> (KeyboardControllerView) {
    return KeyboardControllerView(frame: CGRect.zero, eventDispatcher: bridge.eventDispatcher())
  }
}

extension Date {
    static var currentTimeStamp: Int64{
        return Int64(Date().timeIntervalSince1970 * 1000)
    }
}

class KeyboardControllerView: UIView {
  private var eventDispatcher: RCTEventDispatcherProtocol
  @objc var onKeyboardMove: RCTDirectEventBlock?

  init(frame: CGRect, eventDispatcher: RCTEventDispatcherProtocol) {
    self.eventDispatcher = eventDispatcher
    super.init(frame: frame)
  }

  @available(*, unavailable)
  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func willMove(toWindow newWindow: UIWindow?) {
    if newWindow == nil {
      // Will be removed from a window
      // swiftlint:disable notification_center_detachment
      NotificationCenter.default.removeObserver(self)
    }
  }

  override func didMoveToWindow() {
    if window != nil {
      // Added to a window
      NotificationCenter.default.addObserver(
        self,
        selector: #selector(keyboardWillDisappear),
        name: UIResponder.keyboardWillHideNotification,
        object: nil
      )
      NotificationCenter.default.addObserver(
        self,
        selector: #selector(keyboardWillAppear),
        name: UIResponder.keyboardWillShowNotification,
        object: nil
      )
      NotificationCenter.default.addObserver(
        self,
        selector: #selector(keyboardDidAppear),
        name: UIResponder.keyboardDidShowNotification,
        object: nil
      )
      NotificationCenter.default.addObserver(
        self,
        selector: #selector(keyboardDidDisappear),
        name: UIResponder.keyboardDidHideNotification,
        object: nil
      )
        NotificationCenter.default.addObserver(
          self,
          selector: #selector(keyboardWillChangeFrame),
          name: UIResponder.keyboardWillChangeFrameNotification,
          object: nil
        )
    }
  }

  @objc func keyboardWillAppear(_ notification: Notification) {
      let timeStamp = CACurrentMediaTime() * 1000

    if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
      let keyboardHeight = keyboardFrame.cgRectValue.size.height

      eventDispatcher.send(
        KeyboardMoveEvent(
          viewTag: reactTag,
          height: -keyboardHeight as NSNumber,
          progress: 1
        )
      )
        
        print(1)
        print(timeStamp)
        print(2)

      var data = [AnyHashable: Any]()
      data["height"] = keyboardHeight
      data["timestamp"] = timeStamp
      KeyboardController.shared?.sendEvent(withName: "KeyboardController::keyboardWillShow", body: data)
    }
  }
    
    @objc func keyboardWillChangeFrame(_ notification: Notification) {
        let timeStamp = Date.currentTimeStamp
        print(3)
        print(timeStamp)
        print(4)
    }

  @objc func keyboardWillDisappear() {
      
      let timeStamp = Date.currentTimeStamp
    eventDispatcher.send(KeyboardMoveEvent(viewTag: reactTag, height: 0, progress: 0))

    var data = [AnyHashable: Any]()
    data["height"] = 0
    data["timestamp"] = timeStamp
    KeyboardController.shared?.sendEvent(withName: "KeyboardController::keyboardWillHide", body: data)
  }

  @objc func keyboardDidAppear(_ notification: Notification) {
    if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
      let keyboardHeight = keyboardFrame.cgRectValue.size.height

      var data = [AnyHashable: Any]()
      data["height"] = keyboardHeight

      KeyboardController.shared?.sendEvent(withName: "KeyboardController::keyboardDidShow", body: data)
    }
  }

  @objc func keyboardDidDisappear() {
    var data = [AnyHashable: Any]()
    data["height"] = 0
    KeyboardController.shared?.sendEvent(withName: "KeyboardController::keyboardDidHide", body: data)
  }
}
