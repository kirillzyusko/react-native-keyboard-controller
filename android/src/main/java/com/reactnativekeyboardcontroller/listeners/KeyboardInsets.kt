package com.reactnativekeyboardcontroller.listeners

internal fun resolveKeyboardHeight(
  imeBottom: Int,
  navigationBarBottom: Int,
  hasTranslucentNavigationBar: Boolean,
): Int {
  val heightAboveNavigationBar = (imeBottom - navigationBarBottom).coerceAtLeast(0)

  return if (hasTranslucentNavigationBar && heightAboveNavigationBar > 0) imeBottom else heightAboveNavigationBar
}
