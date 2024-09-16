//
//  OverKeyboardViewManager.swift
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 11/09/2024.
//

@objc(OverKeyboardViewManager)
class OverKeyboardViewManager: RCTViewManager {
  override class func requiresMainQueueSetup() -> Bool {
    return false
  }

  override func view() -> (OverKeyboardView) {
    return OverKeyboardView(frame: CGRect.zero, bridge: bridge)
  }
}

class OverKeyboardView: UIView {
    private var contentView = UIView(frame: CGRect.zero)
    private var touchHandler: RCTTouchHandler?
    
    init(frame: CGRect, bridge: RCTBridge) {
        super.init(frame: frame)
        
        // eagerly initialize the extension
        let _ = UIWindow.sharedKeyboardWindowObserver
        touchHandler = RCTTouchHandler(bridge: bridge)
    }
    
    @available(*, unavailable)
    required init?(coder _: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // react props
    @objc var visible: ObjCBool = false {
        didSet {
            if visible.boolValue {
                showInLastWindow()
            } else {
                hide()
            }
        }
    }
    
    override func addSubview(_ view: UIView) {
        contentView.addSubview(view)
    }

    
    private func showInLastWindow() {
        contentView.frame = window?.bounds ?? .zero
        contentView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        
        let window = UIWindow.topWindow
        window?.addSubview(contentView)
        
        touchHandler?.attach(to: contentView)
    }
    
    private func hide() {
        if (!contentView.subviews.isEmpty) {
            contentView.removeFromSuperview()
            touchHandler?.detach(from: contentView)
        }
    }
}
