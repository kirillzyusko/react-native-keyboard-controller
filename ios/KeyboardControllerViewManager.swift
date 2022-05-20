@objc(KeyboardControllerViewManager)
class KeyboardControllerViewManager: RCTViewManager {
  override class func requiresMainQueueSetup() -> Bool {
    return false
  }

  override func view() -> (KeyboardControllerView) {
      return KeyboardControllerView(frame: CGRect.zero, eventDispatcher: self.bridge.eventDispatcher())
  }
}

class KeyboardControllerView: UIView {
    private var eventDispatcher: RCTEventDispatcherProtocol
    @objc var onKeyboardMove: RCTDirectEventBlock?

    init(frame: CGRect, eventDispatcher: RCTEventDispatcherProtocol) {
        self.eventDispatcher = eventDispatcher
        super.init(frame: frame)
    }

    required init?(coder: NSCoder) {
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
        if self.window != nil {
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
        }
    }

    @objc func keyboardWillAppear(_ notification: Notification) {
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
            let keyboardHeight = keyboardFrame.cgRectValue.size.height

            self.eventDispatcher.send(
                KeyboardMoveEvent(
                    reactTag: self.reactTag,
                    height: -keyboardHeight as NSNumber,
                    progress: 1
                )
            )

            var data = [AnyHashable: Any]()
            data["height"] = keyboardHeight
            KeyboardController.shared?.sendEvent(withName: "KeyboardController::keyboardWillShow", body: data)
        }
    }

    @objc func keyboardWillDisappear() {
        self.eventDispatcher.send(KeyboardMoveEvent(reactTag: self.reactTag, height: 0, progress: 0))

        var data = [AnyHashable: Any]()
        data["height"] = 0
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
