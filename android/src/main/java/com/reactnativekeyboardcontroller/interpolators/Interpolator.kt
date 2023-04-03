package com.reactnativekeyboardcontroller.interpolators

interface Interpolator {
  /**
   * A function that allows you to control the layout of the keyboard
   * depending on the position of the finger on the screen.
   *
   * @param dy the distance that the finger has moved relative to the previous location.
   * @param absoluteFingerPosition current position of the finger.
   * @param keyboardPosition current keyboard position.
   * @return the distance the keyboard should be moved from its current location.
   */
  fun interpolate(dy: Int, absoluteFingerPosition: Int, keyboardPosition: Int): Int
}
