package com.reactnativekeyboardcontroller.interpolators

class IosInterpolator : Interpolator {
  override fun interpolate(
    dY: Int,
    absoluteFingerPos: Int,
    keyboardPosition: Int
  ): Int {
    if (
      absoluteFingerPos <= keyboardPosition // user overscrolled keyboard
      || dY <= 0 // user scrolls up
    ) {
      return dY
    }

    return 0
  }
}
