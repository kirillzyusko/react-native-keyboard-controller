package com.reactnativekeyboardcontroller.managers

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.views.background.KeyboardBackgroundViewGroup

@Suppress("detekt:UnusedPrivateProperty")
class KeyboardBackgroundViewManagerImpl(
  mReactContext: ReactApplicationContext,
) {
  fun createViewInstance(reactContext: ThemedReactContext): KeyboardBackgroundViewGroup =
    KeyboardBackgroundViewGroup(reactContext)

  companion object {
    const val NAME = "KeyboardBackgroundView"
  }
}
