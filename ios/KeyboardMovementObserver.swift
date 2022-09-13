//
//  KeyboardMovementObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 2.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import QuartzCore

extension Date {
    func currentTimeMillis() -> Int64 {
        return Int64(self.timeIntervalSince1970 * 1000)
    }
}

class ProgressView: UIView {
    override class var layerClass: AnyClass {
        return CAProgressLayer.self
    }
}

@objc(KeyboardMovementObserver)
public class KeyboardMovementObserver: NSObject, CAProgressLayerDelegate {
  // private members
  private var _keyboardView: UIView?
  private var keyboardView: UIView? {
    let windowsCount = UIApplication.shared.windows.count

    if _keyboardView == nil || windowsCount != _windowsCount {
      _keyboardView = findKeyboardView()
      _windowsCount = windowsCount
    }

    return _keyboardView
  }

  private var _windowsCount: Int = 0
    private var prevKeyboardTopPosition = 0.0
  private var displayLink: CADisplayLink?
  private var isKeyboardVisible: Bool = false
    private var keyboardHeight = 0.0
  private var positions = [[CGFloat]]()
    private var timestamp: Int64?
    private let movement: [Double] = [];

  // constructor params
  var onEvent: (NSNumber, NSNumber) -> Void
  var onNotify: (String, Any) -> Void
  var view: UIView
  var events = 0

    @objc public init(handler: @escaping (NSNumber, NSNumber) -> Void, onNotify: @escaping (String, Any) -> Void, view: UIView) {
    onEvent = handler
    self.onNotify = onNotify
    self.view = view
  }

  @objc public func mount() {
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardWillDisappear),
      name: UIResponder.keyboardWillHideNotification,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardWillAppear),
      name: UIResponder.keyboardWillShowNotification,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardDidAppear),
      name: UIResponder.keyboardDidShowNotification,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(keyboardDidDisappear),
      name: UIResponder.keyboardDidHideNotification,
      object: nil
    )
  }

  @objc public func unmount() {
    // swiftlint:disable notification_center_detachment
    NotificationCenter.default.removeObserver(self)
  }
    
  @objc func keyboardWillAppear(_ notification: Notification) {
    if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
      let keyboardHeight = keyboardFrame.cgRectValue.size.height

      var data = [AnyHashable: Any]()
      data["height"] = keyboardHeight
        
        self.keyboardHeight = keyboardHeight

      // onEvent(Float(-keyboardHeight) as NSNumber, 1)
      onNotify("KeyboardController::keyboardWillShow", data)
        
        displayLink = CADisplayLink(target: self, selector: #selector(doubleUpdateKeyboardFrame))
        displayLink?.add(to: .main, forMode: .common)
        timestamp = Date().currentTimeMillis()
        // let timer = Timer.scheduledTimer(timeInterval: 1/10000, target: self, selector: #selector(self.updateKeyboardFrame), userInfo: nil, repeats: true)
        // displayLink = CADisplayLink(target: self, selector: #selector(self.sendLatestPosition))
        // displayLink?.add(to: .main, forMode: .common)
        
        
        
        
        /////////
        ///
        
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
            let screenSize: CGRect = UIScreen.main.bounds
            let size = 50.0

            events = 0
            print(isKeyboardVisible)
        /*let sublayer1 = CALayer()
        sublayer1.frame = CGRect(x: 20, y: 762, width: 50, height: 50)
        sublayer1.backgroundColor = UIColor.cyan.cgColor
        sublayer1.cornerRadius = 25
        
        let positionAnimation = CABasicAnimation(keyPath: #keyPath(CALayer.position))
        positionAnimation.fromValue = CGPoint(x: 0, y: 0)
        positionAnimation.toValue = CGPoint(x: 0, y: 500)
        positionAnimation.duration = 5000
        positionAnimation.repeatCount = 1
        positionAnimation.autoreverses = true

        sublayer1.add(positionAnimation, forKey: #keyPath(CALayer.position))
        view.layer.addSublayer(sublayer1)*/

        let globalDuration: CFTimeInterval = 0.25
                let globalRepeatCount: Float = 1.0

                // MARK: Position Animation
                let positionAnimation = CASpringAnimation(keyPath: #keyPath(CALayer.position))
            positionAnimation.fromValue = CGPoint(x: 40, y: screenSize.height-size/2)
            positionAnimation.toValue = CGPoint(x: 40, y: screenSize.height-size/2-keyboardHeight)
                positionAnimation.duration = 0.5
                positionAnimation.damping = 500
                positionAnimation.stiffness = 1000
                positionAnimation.mass = 3
                
                positionAnimation.repeatCount = globalRepeatCount
                positionAnimation.autoreverses = false
              
                // Creation of Sublayer
                let newSublayer = CALayer()
            newSublayer.frame = CGRect(x: 20, y: screenSize.height - size, width: size, height: size)
                newSublayer.cornerRadius = size / 2
                newSublayer.backgroundColor = UIColor.green.cgColor
                view.layer.addSublayer(newSublayer)
              

        let progressView = ProgressView(frame: newSublayer.frame)
                progressView.layer.delegate = self
                view.addSubview(progressView)
        
        var animations = [CAAnimation]()
        
        let progressAnimation = CASpringAnimation(keyPath: "progress")
                progressAnimation.fromValue = 0
                progressAnimation.toValue = 1
                progressAnimation.duration = 0.5
                progressAnimation.damping = 500
                progressAnimation.stiffness = 1000
                progressAnimation.mass = 3
                animations.append(progressAnimation)

        //Apply all animations to sublayer
        CATransaction.begin()
        newSublayer.add(positionAnimation, forKey: #keyPath(CALayer.position))
        progressView.layer.add(progressAnimation, forKey: nil)
        CATransaction.commit()
        }
    }
  }

    func progressDidChange(to progress: CGFloat) {
        if keyboardView == nil {
          return
        }

        let keyboardFrameY = keyboardView!.layer.presentation()!.frame.origin.y
        let keyboardWindowH = keyboardView!.window!.bounds.size.height
        let keyboardTopPosition = (keyboardWindowH - keyboardFrameY)
        // print("OnProgress: \(keyboardTopPosition), \(progress * 336)")
        //onEvent(-keyboardTopPosition as NSNumber, 0.0)

        // print("\(-progress * Double(keyboardHeight)) \(keyboardTopPosition)")
        // print("PROGRESS: \(progress), \(CACurrentMediaTime())")
        // positions.append([CACurrentMediaTime() - timestamp!, (keyboardTopPosition)])
        // positions.append([Double(Date().currentTimeMillis() - timestamp!), (keyboardTopPosition)])
        events += 1
        // prevKeyboardTopPosition = Int((-CGFloat(keyboardHeight)) * progress)
        // onEvent(-keyboardTopPosition as NSNumber, (keyboardTopPosition / keyboardHeight) as NSNumber)
        print("PDC: \(keyboardTopPosition)")
    }

  @objc func keyboardWillDisappear() {
    var data = [AnyHashable: Any]()
    data["height"] = 0
      // self.keyboardHeight = 0

    isKeyboardVisible = false
    displayLink?.invalidate()
    displayLink = nil

    // onEvent(0, 0)
    onNotify("KeyboardController::keyboardWillHide", data)
  }

  @objc func keyboardDidAppear(_ notification: Notification) {
    if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
      if !isKeyboardVisible {
        let keyboardHeight = keyboardFrame.cgRectValue.size.height
        isKeyboardVisible = true
          print(events)
          // prevKeyboardTopPosition = Int(keyboardHeight)

        var data = [AnyHashable: Any]()
        data["height"] = keyboardHeight

        onNotify("KeyboardController::keyboardDidShow", data)
          print(positions)
          positions.removeAll()
        // displayLink = CADisplayLink(target: self, selector: #selector(self.updateKeyboardFrame))
          // displayLink?.add(to: .main, forMode: .common)
      }
    }
  }

  @objc func keyboardDidDisappear() {
    var data = [AnyHashable: Any]()
    data["height"] = 0

    onNotify("KeyboardController::keyboardDidHide", data)
  }

  // https://stackoverflow.com/questions/32598490/show-uiview-with-buttons-over-keyboard-like-in-skype-viber-messengers-swift-i
  func findKeyboardView() -> UIView? {
    var result: UIView?

    let windows = UIApplication.shared.windows
    for window in windows {
      if window.description.hasPrefix("<UITextEffectsWindow") {
        for subview in window.subviews {
          if subview.description.hasPrefix("<UIInputSetContainerView") {
            for sv in subview.subviews {
              if sv.description.hasPrefix("<UIInputSetHostView") {
                result = sv
                break
              }
            }
            break
          }
        }
        break
      }
    }

    return result
  }

    @objc func updateKeyboardFrame(displaylink: CADisplayLink, dl: Double) {
    if keyboardView == nil {
      return
    }
     
      // print("OLD: \(events) \(prevKeyboardTopPosition) \(CACurrentMediaTime())")
      
      /*while (true) {
          if (CACurrentMediaTime() >= displaylink.targetTimestamp) {
                      // no more time
                      break
                  }
      }*/
      
      // print("NEW: \(events) \(prevKeyboardTopPosition) \(CACurrentMediaTime())")

    let keyboardFrameY = keyboardView!.layer.presentation()!.frame.origin.y
    let keyboardWindowH = keyboardView!.window!.bounds.size.height
    let keyboardTopPosition = keyboardWindowH - keyboardFrameY

    if keyboardTopPosition == prevKeyboardTopPosition || keyboardFrameY == 0 {
      return
    }

    prevKeyboardTopPosition = keyboardTopPosition

      // onEvent(Double(-keyboardTopPosition) as NSNumber, Double(prevKeyboardTopPosition) / Double(keyboardHeight) as NSNumber)
      
      // print("CA: \(keyboardTopPosition) - \(displaylink)")
      
      // print("Old: \(keyboardTopPosition1), New: \(keyboardTopPosition)")
      // positions.append([Int(Date().currentTimeMillis() - timestamp!), (keyboardTopPosition)])
      // print("\(Int(Date().currentTimeMillis() - timestamp!)) \(keyboardTopPosition)")
      
      ///////////////////////////////////////////////
      /*var height = 0.0
      var diff = displaylink.targetTimestamp - timestamp!
      for position in movement {
          if (diff > position[0]) {
              height = position[1]
          }
      }
      var height2 = 0.0
      diff = displaylink.timestamp - timestamp!
      for position in movement {
          if (diff > position[0]) {
              height2 = position[1]
          }
      }
      
      // print("\(diff), \(height)")
      print("Metric: \(keyboardTopPosition), NEW (current moment): \(height2), NEW (advanced): \(height), Diff: \(diff), duration: \(displaylink.targetTimestamp - displaylink.timestamp)")*/
      
      var closestTimestamp = 0.0
      for position in KeyboardPositions.normal {
          if (keyboardTopPosition > position[1]) {
              closestTimestamp = position[0]
          }
      }
      let duration = displaylink.targetTimestamp - displaylink.timestamp
      let targetTimestamp = closestTimestamp + 16 - dl // duration
      var height = 0.0
      for position in KeyboardPositions.normal {
          if (targetTimestamp > position[0]) {
              height = position[1]
          }
      }
      // height = (height + keyboardTopPosition) / 2
      
      print("Metric: \(keyboardTopPosition), New: \(height)")
      
      onEvent(-(height) as NSNumber, height / 336 as NSNumber)
      
  }
    /// короче, тут похоже на двойную задержку
    /// оригинальная дата по точным таймстемпам отличается и довольно сильно
    /// но если от первого таймстемпа отнять его же значение (привести к 0)
    /// и в дальнейшем это число отнять от всех последующих таймстемпов
    /// то мы получаем "приведённый" вид данных - и вот этот приведённый вид
    /// уже равен между собой
    /// Вдобавок к этому сам CADisplayLink может вызывать колбек с задержкой
    /// то есть нельзя просто взять и найти ближайший таймстемп, найти от него
    /// значение дальше на 16мс и диспатчнуть этот ивент (надо учитывать дилей)
    ///
    /// Надо подумать, как все эти дилеи компансировать наиболее оптимальным путёми посмотреть, как это будет работать
    @objc func doubleUpdateKeyboardFrame(displaylink: CADisplayLink) {
        let delay = CACurrentMediaTime() - displaylink.timestamp
        
        print("delay: \(delay * 1000)")
        self.updateKeyboardFrame(displaylink: displaylink, dl: delay)
        /*let timer = Timer.scheduledTimer(timeInterval: 1/80, target: self, selector: #selector(self.updateKeyboardFrame), userInfo: nil, repeats: false)*/
    }
    
    @objc func sendLatestPosition() {
        // let diff = Date().currentTimeMillis() - (timestamp ?? 0)
        // print(diff)
        // onEvent(prevKeyboardTopPosition as NSNumber, Double(prevKeyboardTopPosition) / Double(keyboardHeight) as NSNumber)
    }
}
