@objc(KeyboardControllerViewManager)
class KeyboardControllerViewManager: RCTViewManager {
  override class func requiresMainQueueSetup() -> Bool {
    return false
  }

  override func view() -> (KeyboardControllerView) {
      return KeyboardControllerView()
  }
}

class KeyboardControllerView : UIView {
    @objc var onKeyboardMove: RCTDirectEventBlock?
    
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

            var event = [AnyHashable: Any]()
            event["height"] = -keyboardHeight
            event["progress"] = 1

            self.onKeyboardMove?(event)

            var data = [AnyHashable: Any]()
            data["height"] = keyboardHeight
            KeyboardController.shared?.sendEvent(withName: "KeyboardController::keyboardWillShow", body: data)
        }
    }

    @objc func keyboardWillDisappear() {
        var event = [AnyHashable: Any]()
        event["progress"] = 0
        event["height"] = 0

        self.onKeyboardMove?(event)
        
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
