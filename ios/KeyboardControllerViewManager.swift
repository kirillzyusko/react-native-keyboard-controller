@objc(KeyboardControllerViewManager)
class KeyboardControllerViewManager: RCTViewManager {

  override func view() -> (KeyboardControllerView) {
      return KeyboardControllerView()
  }
}

class KeyboardControllerView : UIView {
    @objc var onProgress: RCTDirectEventBlock?
    
    override func didMoveToWindow() {
        print(4567456456, onProgress)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            print(4567456456, self.onProgress)
            if self.onProgress == nil {
                return
              }
            var event = [AnyHashable: Any]()
            event["progress"] = 50

            self.onProgress!(event)
        }
    }
}
