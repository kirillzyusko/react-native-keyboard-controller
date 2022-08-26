//
//  KeyboardMovementObserver.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 2.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation

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
  private var prevKeyboardTopPosition = 0
  private var displayLink: CADisplayLink?
  private var isKeyboardVisible: Bool = false
  private var keyboardHeight: Int = 0
  private var positions = [[Int]]()
    private var timestamp: Int64?
  private let movement = [
    [72, 1],
    [90, 2],
    [105, 3],
    [117, 4],
    [129, 5],
    [139, 6],
    [149, 7],
    [157, 8],
    [166, 9],
    [174, 10],
    [181, 11],
    [189, 12],
    [196, 13],
    [203, 14],
    [211, 15],
    [217, 16],
    [224, 17],
    [230, 18],
    [237, 19],
    [243, 20],
    [249, 21],
    [254, 22],
    [261, 23],
    [267, 24],
    [273, 25],
    [278, 26],
    [283, 27],
    [289, 28],
    [294, 29],
    [300, 30],
    [305, 31],
    [310, 32],
    [316, 33],
    [321, 34],
    [327, 35],
    [332, 36],
    [336, 37],
    [341, 38],
    [346, 39],
    [352, 40],
    [356, 41],
    [361, 42],
    [367, 43],
    [371, 44],
    [376, 45],
    [382, 46],
    [386, 47],
    [390, 48],
    [395, 49],
    [401, 50],
    [405, 51],
    [409, 52],
    [414, 53],
    [419, 54],
    [424, 55],
    [428, 56],
    [433, 57],
    [437, 58],
    [442, 59],
    [447, 60],
    [451, 61],
    [456, 62],
    [460, 63],
    [465, 64],
    [469, 65],
    [474, 66],
    [478, 67],
    [483, 68],
    [488, 69],
    [492, 70],
    [496, 71],
    [501, 72],
    [505, 73],
    [510, 74],
    [514, 75],
    [518, 76],
    [524, 77],
    [528, 78],
    [532, 79],
    [537, 80],
    [541, 81],
    [545, 82],
    [550, 83],
    [554, 84],
    [559, 85],
    [563, 86],
    [568, 87],
    [573, 88],
    [576, 89],
    [581, 90],
    [585, 91],
    [590, 92],
    [595, 93],
    [599, 94],
    [603, 95],
    [607, 96],
    [612, 97],
    [616, 98],
    [621, 99],
    [625, 100],
    [630, 101],
    [635, 102],
    [638, 103],
    [643, 104],
    [648, 105],
    [652, 106],
    [657, 107],
    [661, 108],
    [666, 109],
    [670, 110],
    [674, 111],
    [679, 112],
    [684, 113],
    [688, 114],
    [692, 115],
    [697, 116],
    [701, 117],
    [706, 118],
    [711, 119],
    [715, 120],
    [720, 121],
    [724, 122],
    [729, 123],
    [733, 124],
    [738, 125],
    [742, 126],
    [747, 127],
    [752, 128],
    [757, 129],
    [761, 130],
    [767, 131],
    [770, 132],
    [775, 133],
    [780, 134],
    [784, 135],
    [789, 136],
    [794, 137],
    [798, 138],
    [803, 139],
    [809, 140],
    [813, 141],
    [818, 142],
    [823, 143],
    [828, 144],
    [832, 145],
    [837, 146],
    [842, 147],
    [847, 148],
    [851, 149],
    [856, 150],
    [861, 151],
    [866, 152],
    [871, 153],
    [876, 154],
    [881, 155],
    [886, 156],
    [891, 157],
    [896, 158],
    [901, 159],
    [906, 160],
    [911, 161],
    [916, 162],
    [921, 163],
    [926, 164],
    [931, 165],
    [937, 166],
    [942, 167],
    [947, 168],
    [952, 169],
    [957, 170],
    [962, 171],
    [968, 172],
    [973, 173],
    [979, 174],
    [984, 175],
    [989, 176],
    [995, 177],
    [1000, 178],
    [1005, 179],
    [1011, 180],
    [1016, 181],
    [1022, 182],
    [1027, 183],
    [1033, 184],
    [1038, 185],
    [1044, 186],
    [1050, 187],
    [1055, 188],
    [1061, 189],
    [1068, 190],
    [1072, 191],
    [1079, 192],
    [1084, 193],
    [1090, 194],
    [1096, 195],
    [1102, 196],
    [1108, 197],
    [1113, 198],
    [1119, 199],
    [1125, 200],
    [1132, 201],
    [1138, 202],
    [1144, 203],
    [1150, 204],
    [1156, 205],
    [1163, 206],
    [1169, 207],
    [1176, 208],
    [1182, 209],
    [1188, 210],
    [1194, 211],
    [1201, 212],
    [1207, 213],
    [1214, 214],
    [1221, 215],
    [1227, 216],
    [1234, 217],
    [1240, 218],
    [1248, 219],
    [1254, 220],
    [1261, 221],
    [1268, 222],
    [1275, 223],
    [1282, 224],
    [1289, 225],
    [1296, 226],
    [1304, 227],
    [1311, 228],
    [1317, 229],
    [1325, 230],
    [1332, 231],
    [1340, 232],
    [1347, 233],
    [1354, 234],
    [1362, 235],
    [1370, 236],
    [1378, 237],
    [1386, 238],
    [1394, 239],
    [1401, 240],
    [1409, 241],
    [1418, 242],
    [1426, 243],
    [1434, 244],
    [1442, 245],
    [1451, 246],
    [1459, 247],
    [1467, 248],
    [1477, 249],
    [1485, 250],
    [1494, 251],
    [1503, 252],
    [1512, 253],
    [1521, 254],
    [1531, 255],
    [1540, 256],
    [1549, 257],
    [1559, 258],
    [1568, 259],
    [1578, 260],
    [1588, 261],
    [1598, 262],
    [1608, 263],
    [1617, 264],
    [1628, 265],
    [1638, 266],
    [1648, 267],
    [1659, 268],
    [1670, 269],
    [1681, 270],
    [1693, 271],
    [1704, 272],
    [1715, 273],
    [1727, 274],
    [1738, 275],
    [1751, 276],
    [1763, 277],
    [1775, 278],
    [1787, 279],
    [1800, 280],
    [1813, 281],
    [1827, 282],
    [1839, 283],
    [1853, 284],
    [1867, 285],
    [1881, 286],
    [1896, 287],
    [1910, 288],
    [1924, 289],
    [1940, 290],
    [1955, 291],
    [1971, 292],
    [1987, 293],
    [2004, 294],
    [2020, 295],
    [2038, 296],
    [2056, 297],
    [2074, 298],
    [2093, 299],
    [2111, 300],
    [2130, 301],
    [2150, 302],
    [2171, 303],
    [2192, 304],
    [2215, 305],
    [2236, 306],
    [2259, 307],
    [2283, 308],
    [2309, 309],
    [2335, 310],
    [2361, 311],
    [2387, 312],
    [2417, 313],
    [2447, 314],
    [2478, 315],
    [2510, 316],
    [2544, 317],
    [2580, 318],
    [2620, 319],
    [2659, 320],
    [2701, 321],
    [2747, 322],
    [2795, 323],
    [2848, 324],
    [2906, 325],
    [2968, 326],
    [3035, 327],
    [3112, 328],
    [3197, 329],
    [3298, 330],
    [3412, 331],
    [3554, 332],
    [3735, 333],
    [3989, 334],
    [4419, 335],
    [5027, 336],
  ]

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
    
  ///
  @objc func keyboardWillAppear(_ notification: Notification) {
    if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
      let keyboardHeight = keyboardFrame.cgRectValue.size.height

      var data = [AnyHashable: Any]()
      data["height"] = keyboardHeight
        
        self.keyboardHeight = Int(keyboardHeight)

      // onEvent(Float(-keyboardHeight) as NSNumber, 1)
      onNotify("KeyboardController::keyboardWillShow", data)
        
        // displayLink = CADisplayLink(target: self, selector: #selector(updateKeyboardFrame))
        // displayLink?.add(to: .main, forMode: .common)
        timestamp = Date().currentTimeMillis()
        // let timer = Timer.scheduledTimer(timeInterval: 1/10000, target: self, selector: #selector(self.updateKeyboardFrame), userInfo: nil, repeats: true)
        // displayLink = CADisplayLink(target: self, selector: #selector(self.sendLatestPosition))
        // displayLink?.add(to: .main, forMode: .common)
        
        
        
        
        /////////
        ///
        
        if let keyboardFrame: NSValue = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
          let keyboardHeight = keyboardFrame.cgRectValue.size.height
            let screenSize: CGRect = UIScreen.main.bounds
            let size = 50.0
            self.keyboardHeight = Int(keyboardHeight)
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
        /*if keyboardView == nil {
          return
        }

        let keyboardFrameY = keyboardView!.layer.presentation()!.frame.origin.y
        let keyboardWindowH = keyboardView!.window!.bounds.size.height
        let keyboardTopPosition = (keyboardWindowH - keyboardFrameY)
        
        onEvent(-keyboardTopPosition as NSNumber, 0.0)

        print("\(-progress * Double(keyboardHeight)) \(keyboardTopPosition)")*/
        events += 1
        // prevKeyboardTopPosition = Int((-CGFloat(keyboardHeight)) * progress)
        onEvent(CGFloat(-keyboardHeight) * progress as NSNumber, 0.0)
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

  @objc func updateKeyboardFrame() {
    if keyboardView == nil {
      return
    }

    let keyboardFrameY = keyboardView!.layer.presentation()!.frame.origin.y
    let keyboardWindowH = keyboardView!.window!.bounds.size.height
    let keyboardTopPosition = Int(keyboardWindowH - keyboardFrameY)

    if keyboardTopPosition == prevKeyboardTopPosition || keyboardFrameY == 0 {
      return
    }

    prevKeyboardTopPosition = keyboardTopPosition

      // onEvent(Double(-keyboardTopPosition) as NSNumber, Double(prevKeyboardTopPosition) / Double(keyboardHeight) as NSNumber)
      // positions.append([Int(Date().currentTimeMillis() - timestamp!), (keyboardTopPosition)])
      // print("\(Int(Date().currentTimeMillis() - timestamp!)) \(keyboardTopPosition)")
      
      ///////////////////////////////////////////////
      /*var height = 0
      let diff = Int(Date().currentTimeMillis() - timestamp!)
      for position in movement {
          if (diff > position[0]) {
              height = position[1]
          }
      }
      
      print("\(diff), \(height)")
      
      onEvent(-height as NSNumber, Double(height / 336) as NSNumber)*/
      
  }
    
    @objc func sendLatestPosition() {
        let diff = Date().currentTimeMillis() - (timestamp ?? 0)
        // print(diff)
        onEvent(prevKeyboardTopPosition as NSNumber, Double(prevKeyboardTopPosition) / Double(keyboardHeight) as NSNumber)
    }
}
