//
//  TAProgressLayer.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 23.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation

// TODO: update link
// kindly taken from https://stackoverflow.com/a/35189336

protocol CAProgressLayerDelegate: CALayerDelegate {
    func progressDidChange(to progress: CGFloat)
}

extension CAProgressLayerDelegate {
    func progressDidChange(to progress: CGFloat) {}
}

class CAProgressLayer: CALayer {
    private struct Const {
        static let animationKey: String = "progress"
    }

    @NSManaged private(set) var progress: CGFloat
    private var previousProgress: CGFloat?
    private var progressDelegate: CAProgressLayerDelegate? { return self.delegate as? CAProgressLayerDelegate }

    override init() {
        super.init()
    }

    init(frame: CGRect) {
        super.init()
        self.frame = frame
    }

    override init(layer: Any) {
        super.init(layer: layer)
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        self.progress = CGFloat(aDecoder.decodeFloat(forKey: Const.animationKey))
    }

    override func encode(with aCoder: NSCoder) {
        super.encode(with: aCoder)
        aCoder.encode(Float(self.progress), forKey: Const.animationKey)
    }

    override class func needsDisplay(forKey key: String) -> Bool {
        if key == Const.animationKey { return true }
        return super.needsDisplay(forKey: key)
    }

    override func display() {
        super.display()
        guard let layer: CAProgressLayer = self.presentation() else { return }
        self.progress = layer.progress
        if self.progress != self.previousProgress {
            self.progressDelegate?.progressDidChange(to: self.progress)
        }
        self.previousProgress = self.progress
    }
}
