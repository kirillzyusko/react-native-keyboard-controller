package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.managers.KeyboardToolbarExcludeViewManagerImpl
import com.reactnativekeyboardcontroller.views.KeyboardToolbarExcludeReactViewGroup

class KeyboardToolbarExcludeViewManager(
  mReactContext: ReactApplicationContext,
) : ReactViewManager() {
  private val manager = KeyboardToolbarExcludeViewManagerImpl(mReactContext)

  override fun getName(): String = KeyboardToolbarExcludeViewManagerImpl.NAME

  override fun createViewInstance(reactContext: ThemedReactContext): KeyboardToolbarExcludeReactViewGroup =
    manager.createViewInstance(reactContext)
}
