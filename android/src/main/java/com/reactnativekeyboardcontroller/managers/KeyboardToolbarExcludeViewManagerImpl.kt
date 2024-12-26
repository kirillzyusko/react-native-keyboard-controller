package com.reactnativekeyboardcontroller.managers

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.views.KeyboardToolbarExcludeReactViewGroup
import com.reactnativekeyboardcontroller.views.overlay.OverKeyboardHostView

@Suppress("detekt:UnusedPrivateProperty")
class KeyboardToolbarExcludeViewManagerImpl(mReactContext: ReactApplicationContext) {
  fun createViewInstance(reactContext: ThemedReactContext): KeyboardToolbarExcludeReactViewGroup =
    KeyboardToolbarExcludeReactViewGroup(reactContext)

  companion object {
    const val NAME = "KeyboardToolbarExcludeView"
  }
}
