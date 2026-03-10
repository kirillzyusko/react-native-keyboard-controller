package com.reactnativekeyboardcontroller.managers

import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.views.KeyboardToolbarGroupReactViewGroup

class KeyboardToolbarGroupViewManagerImpl {
  fun createViewInstance(reactContext: ThemedReactContext): KeyboardToolbarGroupReactViewGroup =
    KeyboardToolbarGroupReactViewGroup(reactContext)

  companion object {
    const val NAME = "KeyboardToolbarGroupView"
  }
}
