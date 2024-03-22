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
    private var a: Int64 = 0

  init(frame: CGRect, bridge: RCTBridge) {
    self.bridge = bridge
    eventDispatcher = bridge.eventDispatcher()
    super.init(frame: frame)
    inputObserver = FocusedInputObserver(
      onLayoutChangedHandler: { [weak self] event in self?.onLayoutChanged(event: event) },
      onTextChangedHandler: { [weak self] text in self?.onTextChanged(text: text) },
      onFocusDidSet: { [weak self] event in
        self?.onNotify(event: "KeyboardController::focusDidSet", data: event)
      }
    )
    keyboardObserver = KeyboardMovementObserver(
      handler: { [weak self] event, height, progress, duration, target in
        self?.onEvent(event: event, height: height, progress: progress, duration: duration, target: target)
      },
      onNotify: { [weak self] event, data in
        self?.onNotify(event: event, data: data)
      },
      onRequestAnimation: {[weak self] in
          self?.onRequestAnimation()
      }
    )
      
      // Initialize UITapGestureRecognizer
              let tapGesture = UITapGestureRecognizer(target: self, action: #selector(viewTapped))

              // Add UITapGestureRecognizer to your view
              self.addGestureRecognizer(tapGesture)
  }
    
    // Selector method to handle tap
    @objc func viewTapped() {
        a = Date.currentTimeStamp
        print("View was tapped! \(Date.currentTimeStamp)")
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
    
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
            super.touchesEnded(touches, with: event)
            // Your custom logic here
            print("Touches ended in \(self)")
        }
    
    public override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
                // Return false to allow touch events to pass through
        print("Touches \(self)")
                return true
            }

  func onLayoutChanged(event: NSObject) {
    guard isJSThreadReady() else { return }

    eventDispatcher.send(FocusedInputLayoutChangedEvent(reactTag: reactTag, event: event))
  }

  func onTextChanged(text: String) {
    guard isJSThreadReady() else { return }
      
    eventDispatcher.send(FocusedInputTextChangedEvent(reactTag: reactTag, text: text))
  }

  func onEvent(event: NSString, height: NSNumber, progress: NSNumber, duration: NSNumber, target: NSNumber) {
    guard isJSThreadReady() else { return }
      print("111 \(event) \(Date.currentTimeStamp)")
      if (event == "onKeyboardMoveStart" && height == 0.0 && Date.currentTimeStamp - a < 100) {
          self.onRequestAnimation()
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

    func onRequestAnimation() {
        print("onRequestAnimation")
        bridge.uiManager.scheduleKeyboardAnimation()
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
