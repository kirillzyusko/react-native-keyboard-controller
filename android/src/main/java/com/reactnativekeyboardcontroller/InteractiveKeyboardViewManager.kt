package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager

// TODO: rename to KeyboardGestureArea
class InteractiveKeyboardViewManager(reactContext: ReactApplicationContext) : ReactViewManager() {
  override fun getName() = "InteractiveKeyboardView"

  override fun createViewInstance(context: ThemedReactContext): ReactViewGroup {
    return KeyboardGestureAreaReactViewGroup(context)
  }
}
