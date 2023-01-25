package com.reactnativekeyboardcontroller.interpolators

class IosInterpolator : Interpolator {
  override fun interpolate(
    distanceUntilKeyboard: Int,
    fingerRelativePosition: Int,
    velocity: Int
  ): KeyboardAppearanceProperties {
    return KeyboardAppearanceProperties(1.0f, -Math.min(distanceUntilKeyboard, 0), AnimationDirection.DOWN)
  }
}
