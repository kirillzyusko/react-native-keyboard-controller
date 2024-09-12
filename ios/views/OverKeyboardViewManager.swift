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
    private var overlayWindow: UIWindow?
    private weak var w: UIWindow?
    
    init(frame: CGRect, bridge: RCTBridge) {
        super.init(frame: frame)
        
        // eagerly initialize the extension
        let _ = UIWindow.sharedKeyboardWindowObserver
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
print(UIApplication.shared.connectedScenes)
            
        /*let window = UIWindow.topWindow
        window?.addSubview(contentView)
        contentView.frame = window?.bounds ?? .zero
        // contentView.frame.height = window?.bounds.height ??0
        contentView.subviews[0].frame = window?.bounds ?? .zero*/
        
        let customView2 = UIView()
        customView2.backgroundColor = UIColor.red
            customView2.layer.zPosition = CGFloat(MAXFLOAT)
        customView2.frame = CGRect(x: 0, y: 600, width: 100, height: 100)
        var windowCount = UIApplication.shared.windows.count
        UIApplication.shared.windows.last?.addSubview(contentView)
        let fullScreenBound = UIApplication.shared.windows.last?.bounds ?? .zero
        contentView.frame = fullScreenBound
        contentView.backgroundColor = UIColor.red
        contentView.subviews[0].frame = fullScreenBound
        contentView.subviews[0].backgroundColor = UIColor.green
    }
    
    private func hide() {
        contentView.removeFromSuperview()
    }
}
