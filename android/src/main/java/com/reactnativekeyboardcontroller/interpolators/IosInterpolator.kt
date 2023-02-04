package com.reactnativekeyboardcontroller.interpolators

class IosInterpolator : Interpolator {
  override fun interpolate(
    dY: Int,
    absoluteFingerPosition: Int,
    keyboardPosition: Int
  ): Int {
    if (
      absoluteFingerPosition <= keyboardPosition // user overscrolled keyboard
      || dY <= 0 // user scrolls up
    ) {
      return dY
    }

    return 0
  }
}
