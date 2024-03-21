package com.reactnativekeyboardcontroller.interactive.interpolators

class LinearInterpolator : Interpolator {
  override fun interpolate(
    dy: Int,
    absoluteFingerPosition: Int,
    keyboardPosition: Int,
    offset: Int
  ): Int {
    // TODO: do we need to take offset into consideration?
    return dy
  }
}
