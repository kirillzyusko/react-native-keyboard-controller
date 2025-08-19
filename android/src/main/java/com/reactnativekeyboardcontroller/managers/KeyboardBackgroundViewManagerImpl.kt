package com.reactnativekeyboardcontroller.managers

import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.views.background.KeyboardBackgroundViewGroup

class KeyboardBackgroundViewManagerImpl {
  fun createViewInstance(reactContext: ThemedReactContext): KeyboardBackgroundViewGroup =
    KeyboardBackgroundViewGroup(reactContext)

  companion object {
    const val NAME = "KeyboardBackgroundView"
  }
}
