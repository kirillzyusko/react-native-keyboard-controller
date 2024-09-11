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
    private var contentView: UIView?
    
    init(frame: CGRect, bridge: RCTBridge) {
        super.init(frame: frame)
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
          
        }
      }
    }
    
    override func addSubview(_ view: UIView) {
        if let contentView = contentView {
            contentView.addSubview(view)
        } else {
            super.addSubview(view)
        }
    }
    
    private func showInLastWindow() {
            guard let lastWindow = UIApplication.shared.windows.last else { return }
            
            if contentView == nil {
                contentView = UIView(frame: lastWindow.bounds)
                for subview in subviews {
                    subview.removeFromSuperview()
                    contentView?.addSubview(subview)
                }
            }
            
            if let contentView = contentView {
                lastWindow.addSubview(contentView)
                contentView.frame = lastWindow.bounds
                contentView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            }
            
            isHidden = false
        }
}

