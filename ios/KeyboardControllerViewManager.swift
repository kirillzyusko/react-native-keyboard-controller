@objc(KeyboardControllerViewManager)
class KeyboardControllerViewManager: RCTViewManager {
  override class func requiresMainQueueSetup() -> Bool {
    return false
  }

  override func view() -> (KeyboardControllerView) {
    return KeyboardControllerView(frame: CGRect.zero, bridge: bridge)
  }
}

class KeyboardControllerView: UIView {
  // internal variables
  private var keyboardObserver: KeyboardMovementObserver?
  private var eventDispatcher: RCTEventDispatcherProtocol
  private var bridge: RCTBridge
  // react props
  @objc var onKeyboardMoveStart: RCTDirectEventBlock?
  @objc var onKeyboardMove: RCTDirectEventBlock?
  @objc var onKeyboardMoveEnd: RCTDirectEventBlock?
  @objc var onKeyboardMoveInteractive: RCTDirectEventBlock?

  init(frame: CGRect, bridge: RCTBridge) {
    self.bridge = bridge
    self.eventDispatcher = bridge.eventDispatcher()
    super.init(frame: frame)
  }

  @available(*, unavailable)
  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func willMove(toWindow newWindow: UIWindow?) {
    if newWindow == nil {
      // Will be removed from a window
      keyboardObserver?.unmount()
    }
  }

  override func didMoveToWindow() {
    if window != nil {
      // Added to a window
      keyboardObserver = KeyboardMovementObserver(handler: onEvent, onNotify: onNotify)
      keyboardObserver?.mount()
    }
  }

  func onEvent(event: NSString, height: NSNumber, progress: NSNumber) {
      // we don't want to send event to JS before the JS thread is ready
      if ((bridge.value(forKey: "_jsThread") == nil)) {
          return
      }
      eventDispatcher.send(
        KeyboardMoveEvent(
          reactTag: reactTag,
          event: event as String,
          height: height,
          progress: progress
        )
      )
  }

  func onNotify(event: String, data: Any) {
    KeyboardController.shared()?.sendEvent(event, body: data)
  }
}
