package com.reactnativekeyboardcontroller.interpolators

class LinearInterpolator : Interpolator {
  override fun interpolate(
    distanceUntilKeyboard: Int,
    fingerRelativePosition: Int,
    velocity: Int
  ): KeyboardAppearanceProperties {
    return KeyboardAppearanceProperties(1.0f, fingerRelativePosition, AnimationDirection.UP)
  }
}
