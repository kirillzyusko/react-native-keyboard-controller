//
//  KeyboardMovementObserver+Animation.swift
//  Pods
//
//  Created by Kiryl Ziusko on 07/08/2025.
//

extension KeyboardMovementObserver {
  func initializeAnimation(fromValue: Double, toValue: Double) {
    print(keyboardTrackingView.view?.layer.presentation()?.animationKeys())
    for key in ["position", "opacity"] {
      if let keyboardAnimation = keyboardTrackingView.view?.layer.presentation()?.animation(forKey: key) {
        if let springAnimation = keyboardAnimation as? CASpringAnimation {
          print(springAnimation)
          print(springAnimation.settlingDuration)
          print(springAnimation.mass)
          print(springAnimation.damping)
          print(springAnimation.stiffness)
          animation = SpringAnimation(animation: springAnimation, fromValue: fromValue, toValue: toValue)
        } else if let basicAnimation = keyboardAnimation as? CABasicAnimation {
          animation = TimingAnimation(animation: basicAnimation, fromValue: fromValue, toValue: toValue)
        }
        return
      }
    }
  }
}
