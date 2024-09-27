package com.reactnativekeyboardcontroller.managers

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.views.overlay.OverKeyboardHostView

@Suppress("detekt:UnusedPrivateProperty")
class OverKeyboardViewManagerImpl(
  mReactContext: ReactApplicationContext,
) {
  fun createViewInstance(reactContext: ThemedReactContext): OverKeyboardHostView = OverKeyboardHostView(reactContext)

  fun setVisible(
    view: OverKeyboardHostView,
    value: Boolean,
  ) {
    if (value) {
      view.show()
    } else {
      view.hide()
    }
  }

  companion object {
    const val NAME = "OverKeyboardView"
  }
}
