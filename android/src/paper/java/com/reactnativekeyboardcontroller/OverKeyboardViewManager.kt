package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.managers.OverKeyboardViewManagerImpl
import com.reactnativekeyboardcontroller.views.OverKeyboardViewGroup

class OverKeyboardViewManager(mReactContext: ReactApplicationContext) : ReactViewManager() {
  private val manager = OverKeyboardViewManagerImpl(mReactContext)

  override fun getName(): String = OverKeyboardViewManagerImpl.NAME

  override fun createViewInstance(reactContext: ThemedReactContext): OverKeyboardViewGroup {
    return manager.createViewInstance(reactContext)
  }
}
