package com.reactnativekeyboardcontroller.managers

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.views.KeyboardGestureAreaReactViewGroup

@Suppress("detekt:UnusedPrivateProperty")
class KeyboardGestureAreaViewManagerImpl(mReactContext: ReactApplicationContext) {
  fun createViewInstance(reactContext: ThemedReactContext): KeyboardGestureAreaReactViewGroup {
    return KeyboardGestureAreaReactViewGroup(reactContext)
  }

  fun setInterpolator(view: KeyboardGestureAreaReactViewGroup, interpolator: String) {
    view.setInterpolator(interpolator)
  }

  fun setScrollKeyboardOffScreenWhenVisible(view: KeyboardGestureAreaReactViewGroup, value: Boolean) {
    view.setScrollKeyboardOffScreenWhenVisible(value)
  }

  fun setScrollKeyboardOnScreenWhenNotVisible(view: KeyboardGestureAreaReactViewGroup, value: Boolean) {
    view.setScrollKeyboardOnScreenWhenNotVisible(value)
  }

  companion object {
    const val NAME = "KeyboardGestureArea"
  }
}
