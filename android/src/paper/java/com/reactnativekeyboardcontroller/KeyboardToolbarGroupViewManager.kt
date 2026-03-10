package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.managers.KeyboardToolbarGroupViewManagerImpl
import com.reactnativekeyboardcontroller.views.KeyboardToolbarGroupReactViewGroup

class KeyboardToolbarGroupViewManager(
  mReactContext: ReactApplicationContext,
) : ReactViewManager() {
  private val manager = KeyboardToolbarGroupViewManagerImpl(mReactContext)

  override fun getName(): String = KeyboardToolbarGroupViewManagerImpl.NAME

  override fun createViewInstance(reactContext: ThemedReactContext): KeyboardToolbarGroupReactViewGroup =
    manager.createViewInstance(reactContext)
}
