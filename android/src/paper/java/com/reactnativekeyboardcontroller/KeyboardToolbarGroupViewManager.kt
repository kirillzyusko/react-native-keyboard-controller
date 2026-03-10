package com.reactnativekeyboardcontroller

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.managers.KeyboardToolbarGroupViewManagerImpl
import com.reactnativekeyboardcontroller.views.KeyboardToolbarGroupReactViewGroup

class KeyboardToolbarGroupViewManager : ReactViewManager() {
  private val manager = KeyboardToolbarGroupViewManagerImpl()

  override fun getName(): String = KeyboardToolbarGroupViewManagerImpl.NAME

  override fun createViewInstance(reactContext: ThemedReactContext): KeyboardToolbarGroupReactViewGroup =
    manager.createViewInstance(reactContext)
}
