//
//  KeyboardEventEmitterPayload.swift
//  Pods
//
//  Created by Kiryl Ziusko on 07/12/2024.
//

import Foundation
import UIKit

public class KeyboardTypeConverter: NSObject {
  private static let keyboardTypeToStringMapping: [UIKeyboardType: String] = [
    .default: "default",
    .asciiCapable: "ascii-capable",
    .numbersAndPunctuation: "numbers-and-punctuation",
    .URL: "url",
    .numberPad: "number-pad",
    .phonePad: "phone-pad",
    .namePhonePad: "name-phone-pad",
    .emailAddress: "email-address",
    .decimalPad: "decimal-pad",
    .twitter: "twitter",
    .webSearch: "web-search",
    .asciiCapableNumberPad: "ascii-capable-number-pad",
  ]

  public static func string(from keyboardType: UIKeyboardType?) -> String {
    return keyboardTypeToStringMapping[keyboardType ?? .default] ?? "default"
  }
}

public func buildEventParams(_ height: Double, _ duration: Int, _ responder: UIResponder?)
  -> [AnyHashable: Any]
{
  var data = [AnyHashable: Any]()

  data["height"] = height
  data["duration"] = duration
  data["timestamp"] = Date.currentTimeStamp
  data["target"] = responder.reactViewTag
  data["type"] = KeyboardTypeConverter.string(from: (responder as? TextInput)?.keyboardType)

  return data
}
