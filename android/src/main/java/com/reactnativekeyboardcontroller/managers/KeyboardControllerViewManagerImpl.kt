package com.reactnativekeyboardcontroller.managers

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.views.EdgeToEdgeReactViewGroup

@Suppress("detekt:UnusedPrivateProperty")
class KeyboardControllerViewManagerImpl(mReactContext: ReactApplicationContext) {
  fun createViewInstance(reactContext: ThemedReactContext): EdgeToEdgeReactViewGroup {
    return EdgeToEdgeReactViewGroup(reactContext)
  }

  fun setEnabled(view: EdgeToEdgeReactViewGroup, enabled: Boolean) {
    view.setActive(enabled)
  }

  fun setStatusBarTranslucent(view: EdgeToEdgeReactViewGroup, isStatusBarTranslucent: Boolean) {
    view.setStatusBarTranslucent(isStatusBarTranslucent)
  }

  fun setNavigationBarTranslucent(view: EdgeToEdgeReactViewGroup, isNavigationBarTranslucent: Boolean) {
    view.setNavigationBarTranslucent(isNavigationBarTranslucent)
  }

  fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
    val map: MutableMap<String, Any> = MapBuilder.of(
      "topKeyboardMove",
      MapBuilder.of("registrationName", "onKeyboardMove"),
      "topKeyboardMoveStart",
      MapBuilder.of("registrationName", "onKeyboardMoveStart"),
      "topKeyboardMoveEnd",
      MapBuilder.of("registrationName", "onKeyboardMoveEnd"),
      "topKeyboardMoveInteractive",
      MapBuilder.of("registrationName", "onKeyboardMoveInteractive"),
      "topFocusedInputLayoutChanged",
      MapBuilder.of("registrationName", "onFocusedInputLayoutChanged"),
      "topFocusedInputTextChanged",
      MapBuilder.of("registrationName", "onFocusedInputTextChanged"),
    )

    return map
  }

  companion object {
    const val NAME = "KeyboardControllerView"
  }
}
