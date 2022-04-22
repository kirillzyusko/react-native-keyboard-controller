@objc(KeyboardControllerViewManager)
class KeyboardControllerViewManager: RCTViewManager {

  override func view() -> (KeyboardControllerView) {
      return KeyboardControllerView()
  }
}

class KeyboardControllerView : UIView {
    @objc var onProgress: RCTDirectEventBlock?
    
    override func willMove(toWindow newWindow: UIWindow?) {
        super.willMove(toWindow: newWindow)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillDisappear), name: UIResponder.keyboardWillHideNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillAppear), name: UIResponder.keyboardWillShowNotification, object: nil)
        /*NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChangeFrame), name: UIResponder.keyboardWillChangeFrameNotification, object: nil)*/
    }
    
    /*@objc func keyboardWillChangeFrame(_ notification: Notification) {
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
            let keyboardHeight = keyboardFrame.cgRectValue.size.height

            var event = [AnyHashable: Any]()
            event["progress"] = -keyboardHeight

            self.onProgress!(event)
        }
    }*/

    @objc func keyboardWillAppear(_ notification: Notification) {
        print("keyboardWillAppear", notification)
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
            let keyboardHeight = keyboardFrame.cgRectValue.size.height

            var event = [AnyHashable: Any]()
            event["progress"] = -keyboardHeight

            self.onProgress!(event)
        }
    }

    @objc func keyboardWillDisappear() {
        var event = [AnyHashable: Any]()
        event["progress"] = 0

        self.onProgress!(event)
    }

    override func willRemoveSubview(_ subview: UIView) {
        super.willRemoveSubview(subview)
        NotificationCenter.default.removeObserver(self) // TODO: correct place?
    }
}
