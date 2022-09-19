package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager

class KeyboardControllerViewManager(mReactContext: ReactApplicationContext) : ReactViewManager() {
  private val manager = KeyboardControllerViewManagerImpl(mReactContext)

  override fun getName(): String = KeyboardControllerViewManagerImpl.NAME

  override fun createViewInstance(reactContext: ThemedReactContext): ReactViewGroup {
    return manager.createViewInstance(reactContext)
  }

  @ReactProp(name = "statusBarTranslucent")
  fun setStatusBarTranslucent(view: ReactViewGroup, isStatusBarTranslucent: Boolean) {
    manager.setStatusBarTranslucent(view, isStatusBarTranslucent)
  }

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
    return manager.getExportedCustomDirectEventTypeConstants()
  }
}
