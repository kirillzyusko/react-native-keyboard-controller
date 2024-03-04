package com.reactnativekeyboardcontroller.managers

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.views.OverKeyboardViewGroup

@Suppress("detekt:UnusedPrivateProperty")
class OverKeyboardViewManagerImpl(mReactContext: ReactApplicationContext) {
  fun createViewInstance(reactContext: ThemedReactContext): OverKeyboardViewGroup {
    return OverKeyboardViewGroup(reactContext)
  }

  companion object {
    const val NAME = "OverKeyboardView"
  }
}
