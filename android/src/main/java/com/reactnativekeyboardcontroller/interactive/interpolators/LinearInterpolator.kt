package com.reactnativekeyboardcontroller.interactive.interpolators

class LinearInterpolator : Interpolator {
  override fun interpolate(
    dy: Int,
    absoluteFingerPosition: Int,
    keyboardPosition: Int,
    offset: Int,
  ): Int = dy
}
