package com.reactnativekeyboardcontroller.interpolators

enum class AnimationDirection {
  UP, DOWN
}

data class KeyboardAppearanceProperties(
  var opacity: Float,
  var position: Int,
  var animationDirectionWhenFingerIsReleased: AnimationDirection
)

interface Interpolator {
  // arguments:
  // keyboardHeight, absoluteFingerPosition, screenHeight, velocity, animationDirectionWhenFingerIsReleased
  // interpolate(distanceUntilKeyboard, fingerRelativePosition)
  // returns:
  // dY (position shift), opacity
  fun interpolate(distanceUntilKeyboard: Int, fingerRelativePosition: Int, velocity: Int): KeyboardAppearanceProperties
}
