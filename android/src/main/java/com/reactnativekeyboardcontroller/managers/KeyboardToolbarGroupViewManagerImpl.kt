package com.reactnativekeyboardcontroller.managers

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.views.KeyboardToolbarGroupReactViewGroup

@Suppress("detekt:UnusedPrivateProperty")
class KeyboardToolbarGroupViewManagerImpl(
  mReactContext: ReactApplicationContext,
) {
  fun createViewInstance(reactContext: ThemedReactContext): KeyboardToolbarGroupReactViewGroup =
    KeyboardToolbarGroupReactViewGroup(reactContext)

  companion object {
    const val NAME = "KeyboardToolbarGroupView"
  }
}
