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
  private var inputObserver: FocusedInputLayoutObserver?
  private var eventDispatcher: RCTEventDispatcherProtocol
  private var bridge: RCTBridge
  // react callbacks
  @objc var onKeyboardMoveStart: RCTDirectEventBlock?
  @objc var onKeyboardMove: RCTDirectEventBlock?
  @objc var onKeyboardMoveEnd: RCTDirectEventBlock?
  @objc var onKeyboardMoveInteractive: RCTDirectEventBlock?
  // react props
  @objc var enabled: ObjCBool = true {
    didSet {
      if enabled.boolValue {
        inputObserver?.mount()
        keyboardObserver?.mount()
      } else {
        inputObserver?.unmount()
        keyboardObserver?.unmount()
      }
    }
  }

  init(frame: CGRect, bridge: RCTBridge) {
    self.bridge = bridge
    eventDispatcher = bridge.eventDispatcher()
    super.init(frame: frame)
  }

  @available(*, unavailable)
  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  // for mounting/unmounting observers for lifecycle events we're using willMove(toSuperview) method
  // not willMove(toWindow)
  // see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/271
  override func willMove(toSuperview newSuperview: UIView?) {
    super.willMove(toSuperview: newSuperview)

    if newSuperview == nil {
      // The view is about to be removed from its superview (destroyed)
      inputObserver?.unmount()
      keyboardObserver?.unmount()
    } else {
      inputObserver = FocusedInputLayoutObserver(handler: onInput)
      inputObserver?.mount()
      keyboardObserver = KeyboardMovementObserver(handler: onEvent, onNotify: onNotify)
      keyboardObserver?.mount()
    }
  }

  func onInput(event: NSObject) {
    // we don't want to send event to JS before the JS thread is ready
    if bridge.value(forKey: "_jsThread") == nil {
      return
    }
    eventDispatcher.send(FocusedInputLayoutChangedEvent(reactTag: reactTag, event: event))
  }

  func onEvent(event: NSString, height: NSNumber, progress: NSNumber, duration: NSNumber, target: NSNumber) {
    // we don't want to send event to JS before the JS thread is ready
    if bridge.value(forKey: "_jsThread") == nil {
      return
    }
    eventDispatcher.send(
      KeyboardMoveEvent(
        reactTag: reactTag,
        event: event as String,
        height: height,
        progress: progress,
        duration: duration,
        target: target
      )
    )
  }

  func onNotify(event: String, data: Any) {
    KeyboardController.shared()?.sendEvent(event, body: data)
  }
}
