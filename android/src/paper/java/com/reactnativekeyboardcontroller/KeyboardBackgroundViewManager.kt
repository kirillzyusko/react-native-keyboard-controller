package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.managers.KeyboardBackgroundViewManagerImpl
import com.reactnativekeyboardcontroller.views.background.KeyboardBackgroundViewGroup

class KeyboardBackgroundViewManager(mReactContext: ReactApplicationContext): ReactViewManager() {
  private val manager = KeyboardBackgroundViewManagerImpl(mReactContext)

  override fun getName(): String = KeyboardBackgroundViewManagerImpl.NAME

  override fun createViewInstance(reactContext: ThemedReactContext): KeyboardBackgroundViewGroup =
    manager.createViewInstance(reactContext)
}
