@objc(KeyboardControllerViewManager)
class KeyboardControllerViewManager: RCTViewManager {
  override class func requiresMainQueueSetup() -> Bool {
    return false
  }

  override func view() -> (KeyboardControllerView) {
    return KeyboardControllerView(frame: CGRect.zero, bridge: bridge)
  }

  @objc
  public func moveTo(_ tag: NSNumber, to: NSNumber) {
    print(to)
    DispatchQueue.main.async {
      KeyboardView.find()?.layer.presentation()?.frame.origin.y += CGFloat(to)
      print(KeyboardView.find()?.layer.presentation()?.frame.origin.y)
      
      /*if let window = UIWindow.topWindow {
        // Get the current frame of the window
        var frame = window.frame
        
        // Move the window horizontally by adjusting the x-coordinate
        frame.origin.y += CGFloat(to)  // Move the window 50 points to the right (use -50 to move left)
        
        // Apply the updated frame to the window
        window.frame = frame
      }*/
    }
  }
}

class KeyboardControllerView: UIView {
  // internal variables
  public var keyboardObserver: KeyboardMovementObserver?
  private var inputObserver: FocusedInputObserver?
  private var eventDispatcher: RCTEventDispatcherProtocol
  private var bridge: RCTBridge
  // react callbacks
  /// keyboard
  @objc var onKeyboardMoveStart: RCTDirectEventBlock?
  @objc var onKeyboardMove: RCTDirectEventBlock?
  @objc var onKeyboardMoveEnd: RCTDirectEventBlock?
  @objc var onKeyboardMoveInteractive: RCTDirectEventBlock?
  /// focused input
  @objc var onFocusedInputLayoutChanged: RCTDirectEventBlock?
  @objc var onFocusedInputTextChanged: RCTDirectEventBlock?
  @objc var onFocusedInputSelectionChanged: RCTDirectEventBlock?
  // react props
  @objc var enabled: ObjCBool = true {
    didSet {
      if enabled.boolValue {
        mount()
      } else {
        unmount()
      }
    }
  }

  init(frame: CGRect, bridge: RCTBridge) {
    self.bridge = bridge
    eventDispatcher = bridge.eventDispatcher()
    super.init(frame: frame)
    inputObserver = FocusedInputObserver(
      onLayoutChangedHandler: { [weak self] event in self?.onLayoutChanged(event: event) },
      onTextChangedHandler: { [weak self] text in self?.onTextChanged(text: text) },
      onSelectionChangedHandler: { [weak self] event in self?.onSelectionChanged(event: event) },
      onFocusDidSet: { [weak self] event in
        self?.onNotify(event: "KeyboardController::focusDidSet", data: event)
      }
    )
    keyboardObserver = KeyboardMovementObserver(
      handler: { [weak self] event, height, progress, duration, target in
        self?.onEvent(
          event: event, height: height, progress: progress, duration: duration, target: target)
      },
      onNotify: { [weak self] event, data in
        self?.onNotify(event: event, data: data)
      },
      onRequestAnimation: { [weak self] in
        self?.onRequestAnimation()
      },
      onCancelAnimation: { [weak self] in
        self?.onCancelAnimation()
      }
    )
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
      unmount()
    } else {
      mount()
    }
  }

  func onLayoutChanged(event: NSObject) {
    guard isJSThreadReady() else { return }

    eventDispatcher.send(FocusedInputLayoutChangedEvent(reactTag: reactTag, event: event))
  }

  func onTextChanged(text: String) {
    guard isJSThreadReady() else { return }

    eventDispatcher.send(FocusedInputTextChangedEvent(reactTag: reactTag, text: text))
  }

  func onSelectionChanged(event: NSObject) {
    guard isJSThreadReady() else { return }

    eventDispatcher.send(FocusedInputSelectionChangedEvent(reactTag: reactTag, event: event))
  }

  func onEvent(
    event: NSString, height: NSNumber, progress: NSNumber, duration: NSNumber, target: NSNumber
  ) {
    guard isJSThreadReady() else { return }

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

  func onRequestAnimation() {
    // bridge.uiManager.scheduleKeyboardAnimation()
  }

  func onCancelAnimation() {
    // bridge.uiManager.unscheduleKeyboardAnimation()
  }

  func onNotify(event: String, data: Any) {
    KeyboardController.shared()?.sendEvent(event, body: data)
  }

  private func mount() {
    inputObserver?.mount()
    keyboardObserver?.mount()
  }

  private func unmount() {
    inputObserver?.unmount()
    keyboardObserver?.unmount()
  }

  private func isJSThreadReady() -> Bool {
    // we don't want to send event to JS before the JS thread is ready
    return bridge.value(forKey: "_jsThread") != nil
  }
}
