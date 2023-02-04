package com.reactnativekeyboardcontroller.interpolators

class LinearInterpolator : Interpolator {
  override fun interpolate(
    dY: Int,
    absoluteFingerPosition: Int,
    keyboardPosition: Int
  ): Int {
    return dY
  }
}
