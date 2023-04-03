package com.reactnativekeyboardcontroller.interpolators

class LinearInterpolator : Interpolator {
  override fun interpolate(
    dy: Int,
    absoluteFingerPosition: Int,
    keyboardPosition: Int,
  ): Int {
    return dy
  }
}
