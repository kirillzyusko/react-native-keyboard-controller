//
//  InvisibleInputAccessoryView.swift
//  KeyboardController
//
//  Created by Kiryl Ziusko on 22/03/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation
import UIKit

public class InvisibleInputAccessoryView: UIView {
    private var height: CGFloat = 10

    override init(frame: CGRect) {
        super.init(frame: frame)
        setupView()
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        setupView()
    }

    public override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
            // Return false to allow touch events to pass through
            return false
        }
    
    public func updateHeight(to newHeight: CGFloat) {
        height = newHeight
                // Invalidate intrinsic content size to trigger a layout update
                invalidateIntrinsicContentSize()
        self.layoutIfNeeded()
    }
    
    public override var intrinsicContentSize: CGSize {
        return CGSize(width: UIView.noIntrinsicMetric, height: height)
    }
    
    private func setupView() {
        // Set the background color to red
        backgroundColor = UIColor.red
    }
}
