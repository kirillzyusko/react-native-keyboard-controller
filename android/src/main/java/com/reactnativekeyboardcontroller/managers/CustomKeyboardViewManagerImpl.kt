package com.reactnativekeyboardcontroller.managers

import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.views.customkeyboard.CustomKeyboardHostView

class CustomKeyboardViewManagerImpl {
  fun createViewInstance(reactContext: ThemedReactContext): CustomKeyboardHostView =
    CustomKeyboardHostView(reactContext)

  fun setEnabled(
    view: CustomKeyboardHostView,
    value: Boolean,
  ) {
    view.active = value
  }

  companion object {
    const val NAME = "CustomKeyboardView"
  }
}
