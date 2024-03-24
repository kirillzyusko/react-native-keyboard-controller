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
    
    private func setupView() {
        // Set the background color to red
        backgroundColor = UIColor.red

        // You can customize the appearance of the accessory view here
        // Add any additional subviews or configure constraints if needed
    }
}
