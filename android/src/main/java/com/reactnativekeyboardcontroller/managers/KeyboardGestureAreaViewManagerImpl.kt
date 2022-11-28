package com.reactnativekeyboardcontroller.managers

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.views.KeyboardGestureAreaReactViewGroup

class KeyboardGestureAreaViewManagerImpl(reactContext: ReactApplicationContext) {
  fun createViewInstance(reactContext: ThemedReactContext): KeyboardGestureAreaReactViewGroup {
    return KeyboardGestureAreaReactViewGroup(reactContext)
  }

  fun setInterpolator(view: KeyboardGestureAreaReactViewGroup, interpolator: String) {
    view.setInterpolator(interpolator)
  }

  companion object {
    const val NAME = "KeyboardGestureArea"
  }
}
