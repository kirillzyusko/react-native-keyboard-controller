package com.reactnativekeyboardcontroller.managers

import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.views.KeyboardGestureAreaReactViewGroup2

class KeyboardGestureArea2ViewManagerImpl {
  fun createViewInstance(reactContext: ThemedReactContext): KeyboardGestureAreaReactViewGroup2 {
    return KeyboardGestureAreaReactViewGroup2(reactContext)
  }

  companion object {
    const val NAME = "KeyboardGestureArea2"
  }
}
