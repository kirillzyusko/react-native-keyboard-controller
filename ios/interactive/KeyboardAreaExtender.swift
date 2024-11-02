//
//  KeyboardAreaExtender.swift
//  Pods
//
//  Created by Kiryl Ziusko on 02/11/2024.
//

class KeyboardAreaExtender : NSObject {
  private var currentInputAccessoryView: InvisibleInputAccessoryView?
  
  @objc public static let shared = KeyboardAreaExtender()
  
  private override init() {
    
  }
  
  public var offset: Int {
    get {
      return currentInputAccessoryView?.frame?.height ?? 0
    }
  }
  
  public func remove() {
    
  }
  
  public func updateHeight(newHeight to: CGFloat) {
    currentInputAccessoryView?.updateHeight(to: newHeight)
  }
}
