package com.reactnativekeyboardcontroller.interactive.interpolators

class IosInterpolator : Interpolator {
  override fun interpolate(
    dy: Int,
    absoluteFingerPosition: Int,
    keyboardPosition: Int,
  ): Int {
    if (
      absoluteFingerPosition <= keyboardPosition || // user over scrolled keyboard
      dy <= 0 // user scrolls up
    ) {
      return dy
    }

    return 0
  }
}
