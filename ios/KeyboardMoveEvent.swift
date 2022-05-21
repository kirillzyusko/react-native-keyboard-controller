//
//  KeyboardMoveEvent.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 26.04.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

class KeyboardMoveEvent: NSObject, RCTEvent {
    var viewTag: NSNumber!
    var eventName: String = "onKeyboardMove"
    var coalescingKey: UInt16 = 0
    var height: NSNumber!
    var progress: NSNumber!

    func canCoalesce() -> Bool {
        return false
    }

    func coalesce(with newEvent: RCTEvent!) -> RCTEvent! {
        return newEvent
    }

    static func moduleDotMethod() -> String! {
        return "RCTEventEmitter.receiveEvent"
    }

    func arguments() -> [Any]! {
        return [
            self.viewTag,
            RCTNormalizeInputEventName(self.eventName),
            ["height": self.height, "progress": self.progress]
        ]
    }

    init(reactTag: NSNumber, height: NSNumber, progress: NSNumber) {
        self.viewTag = reactTag
        self.height = height
        self.progress = progress
    }
}
