//
//  KeyboardEventEmitterPayload.swift
//  Pods
//
//  Created by Kiryl Ziusko on 04/12/2024.
//

import Foundation

public func buildEventParams(_ height: Double, _ duration: Int, _ tag: NSNumber) -> [AnyHashable: Any] {
  var data = [AnyHashable: Any]()
  data["height"] = height
  data["duration"] = duration
  data["timestamp"] = Date.currentTimeStamp
  data["target"] = tag

  return data
}
