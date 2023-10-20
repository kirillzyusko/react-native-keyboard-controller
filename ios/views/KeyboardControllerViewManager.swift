@objc(KeyboardControllerViewManager)
class KeyboardControllerViewManager: RCTViewManager {
  override class func requiresMainQueueSetup() -> Bool {
    return false
  }
    
    @objc(syncUpFocusedInput:)
        public func syncUpFocusedInput(_ reactTag: NSNumber) {
            /*guard let view = self.viewRegistry_DEPRECATED?[reactTag] as? KeyboardControllerView else {
                if RCT_DEBUG == 1 {
                    print("Invalid view returned from registry, expecting KeyboardControllerView")
                }
                return
            }*/

            // let a = self.bridge.uiManager.view(forReactTag: reactTag)
            // view.inputObserver?.syncUpLayout()
            /*self.bridge.uiManager.addUIBlock { _, viewRegistry in
                        guard let view = viewRegistry?[reactTag] as? KeyboardControllerView else {
                            if RCT_DEBUG == 1 {
                                print("Invalid view returned from registry, expecting KeyboardControllerView")
                            }
                            return
                        }

                        view.inputObserver?.syncUpLayout()
                    }*/
            /*if let rootView = UIApplication.shared.keyWindow?.rootViewController?.view {
                  // Access the view using its tag
                let reactView = rootView.viewWithTag(Int(reactTag))
                  print(reactView)
                  
                } else {
                  // reject("VIEW_NOT_FOUND", "Root view not found", nil)
                }*/
            print(Date.currentTimeStamp)
            bridge.eventDispatcher().send(FocusedInputLayoutChangedEvent(reactTag: reactTag, event: [
                "target": reactTag,
                "layout": [
                  "absoluteX": -2,
                  "absoluteY": 300,
                  "width": -2,
                  "height": 50,
                  "x": -1,
                  "y": -1,
                ],
            ] as NSObject))
            print(Date.currentTimeStamp)
        }

  override func view() -> (KeyboardControllerView) {
    return KeyboardControllerView(frame: CGRect.zero, bridge: bridge)
  }
}

class KeyboardControllerView: UIView {
  // internal variables
  private var keyboardObserver: KeyboardMovementObserver?
  // TODO: not internal anymore?
  public var inputObserver: FocusedInputLayoutObserver?
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

  override func willMove(toWindow newWindow: UIWindow?) {
    if newWindow == nil {
      // Will be removed from a window
      inputObserver?.unmount()
      keyboardObserver?.unmount()
    }
  }

  override func didMoveToWindow() {
    if window != nil {
      // Added to a window
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
