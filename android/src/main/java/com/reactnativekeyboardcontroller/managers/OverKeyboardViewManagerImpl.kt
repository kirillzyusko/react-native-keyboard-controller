package com.reactnativekeyboardcontroller.managers

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.views.OverKeyboardHostView

@Suppress("detekt:UnusedPrivateProperty")
class OverKeyboardViewManagerImpl(mReactContext: ReactApplicationContext) {
  fun createViewInstance(reactContext: ThemedReactContext): OverKeyboardHostView {
    return OverKeyboardHostView(reactContext)
  }

  companion object {
    const val NAME = "OverKeyboardView"
  }
}
