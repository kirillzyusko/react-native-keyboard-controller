@objc(KeyboardControllerViewManager)
class KeyboardControllerViewManager: RCTViewManager {
  override class func requiresMainQueueSetup() -> Bool {
    return false
  }

  override func view() -> (KeyboardControllerView) {
    return KeyboardControllerView(frame: CGRect.zero, bridge: bridge)
  }
}

class KeyboardControllerView: UIView, UIGestureRecognizerDelegate {
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
    //
    let tapGestureRecognizer = UIPanGestureRecognizer(target: KeyboardControllerView.self, action: #selector(viewTapped))

  init(frame: CGRect, bridge: RCTBridge) {
      UITextField.setupSwizzling
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
        self?.onEvent(event: event, height: height, progress: progress, duration: duration, target: target)
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

  func onEvent(event: NSString, height: NSNumber, progress: NSNumber, duration: NSNumber, target: NSNumber) {
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
      
      // Create the Tap Gesture Recognizer
              let tapGestureRecognizer = UIPanGestureRecognizer(target: self, action: #selector(viewTapped))
              
              // Add the Gesture Recognizer to your view
              self.addGestureRecognizer(tapGestureRecognizer)
      
      tapGestureRecognizer.delegate = self
  }
    
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
        // Check if one of the recognizers is the pan gesture recognizer
        if gestureRecognizer == tapGestureRecognizer || otherGestureRecognizer == tapGestureRecognizer {
            return true
        }
        return true
    }
    
    // Action method for the gesture recognizer
        @objc func viewTapped(_ gesture: UIPanGestureRecognizer) {
            print("View was tapped! \(gesture.state)")
            if gesture.state == .ended {
                (UIResponder.current?.inputAccessoryView as? InvisibleInputAccessoryView)?.updateHeight(to: 0)
                UIResponder.current?.inputAccessoryView?.superview?.layoutIfNeeded()
            }
            /*let translation = gesture.translation(in: self) // Get the translation of the gesture
                if gesture.state == .began || gesture.state == .changed {
                    guard let gestureView = gesture.view else { return }
                    KeyboardView.find()?.center = CGPoint(x: gestureView.center.x + translation.x, y: gestureView.center.y + translation.y)
                    gesture.setTranslation(.zero, in: self) // Reset the translation of the gesture recognizer to {0, 0}
                }*/
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
