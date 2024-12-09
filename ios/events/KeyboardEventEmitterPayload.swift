//
//  KeyboardEventEmitterPayload.swift
//  Pods
//
//  Created by Kiryl Ziusko on 07/12/2024.
//

import Foundation
import UIKit

public func buildEventParams(_ height: Double, _ duration: Int, _ tag: NSNumber) -> [AnyHashable: Any] {
  var data = [AnyHashable: Any]()
  let input = FocusedInputHolder.shared.get()

  data["height"] = height
  data["duration"] = duration
  data["timestamp"] = Date.currentTimeStamp
  data["target"] = tag
  data["type"] = input?.keyboardType.name ?? "default"
  data["appearance"] = input?.keyboardAppearance.name ?? "default"

  return data
}
