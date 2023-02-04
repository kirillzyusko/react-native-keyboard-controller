package com.reactnativekeyboardcontroller.interpolators

class LinearInterpolator : Interpolator {
  override fun interpolate(
    dY: Int,
    absoluteFingerPos: Int,
    keyboardPosition: Int
  ): Int {
    return dY
  }
}
