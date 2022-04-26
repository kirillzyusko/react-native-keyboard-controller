@objc(KeyboardControllerViewManager)
class KeyboardControllerViewManager: RCTViewManager {
  override class func requiresMainQueueSetup() -> Bool {
    return false
  }

  override func view() -> (KeyboardControllerView) {
      return KeyboardControllerView(frame: CGRect.zero, eventDispatcher: self.bridge.eventDispatcher())
  }
}

class KeyboardControllerView : UIView {
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
        super.willMove(toWindow: newWindow)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillDisappear), name: UIResponder.keyboardWillHideNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillAppear), name: UIResponder.keyboardWillShowNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardDidAppear), name: UIResponder.keyboardDidShowNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardDidDisappear), name: UIResponder.keyboardDidHideNotification, object: nil)
    }

    @objc func keyboardWillAppear(_ notification: Notification) {
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
            let keyboardHeight = keyboardFrame.cgRectValue.size.height

            self.eventDispatcher.send(KeyboardMoveEvent(reactTag: self.reactTag, height: -keyboardHeight as NSNumber, progress: 1))

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

    override func willRemoveSubview(_ subview: UIView) {
        super.willRemoveSubview(subview)
        NotificationCenter.default.removeObserver(self) // TODO: correct place?
    }
}
