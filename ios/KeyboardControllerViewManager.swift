@objc(KeyboardControllerViewManager)
class KeyboardControllerViewManager: RCTViewManager {

  override func view() -> (KeyboardControllerView) {
    return KeyboardControllerView()
  }
}

class KeyboardControllerView : UIView {

}
