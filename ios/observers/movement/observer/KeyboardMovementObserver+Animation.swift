//
//  KeyboardMovementObserver+Animation.swift
//  Pods
//
//  Created by Kiryl Ziusko on 07/08/2025.
//

extension KeyboardMovementObserver {
  func initializeAnimation(fromValue: Double, toValue: Double) {
    for key in ["position", "opacity"] {
      if let keyboardAnimation = keyboardTrackingView.view?.layer.presentation()?.animation(forKey: key) {
        if let springAnimation = keyboardAnimation as? CASpringAnimation {
          animation = SpringAnimation(animation: springAnimation, fromValue: fromValue, toValue: toValue)
        } else if let basicAnimation = keyboardAnimation as? CABasicAnimation {
          animation = TimingAnimation(animation: basicAnimation, fromValue: fromValue, toValue: toValue)
        }
        return
      }
    }

    // No CoreAnimation animation attached: drop whatever is left from the
    // previous transition rather than keeping it, or `updateKeyboardFrame`
    // early-returns forever on its already-satisfied `isFinished`.
    animation = nil
  }
}
