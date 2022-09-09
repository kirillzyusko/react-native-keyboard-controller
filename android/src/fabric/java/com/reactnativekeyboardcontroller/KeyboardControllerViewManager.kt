package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.KeyboardControllerViewManagerDelegate
import com.facebook.react.viewmanagers.KeyboardControllerViewManagerInterface
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager

class KeyboardControllerViewManager(mReactContext: ReactApplicationContext) : ReactViewManager(), KeyboardControllerViewManagerInterface<ReactViewGroup> {
  private val manager = KeyboardControllerViewManagerImpl(mReactContext)
  private val mDelegate = KeyboardControllerViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<ReactViewGroup?> {
    return mDelegate
  }

  override fun getName(): String = KeyboardControllerViewManagerImpl.NAME

  override fun createViewInstance(context: ThemedReactContext): ReactViewGroup {
    return manager.createViewInstance(context)
  }

  override fun setStatusBarTranslucent(view: ReactViewGroup, value: Boolean) {
    return manager.setStatusBarTranslucent(view, value)
  }

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
    return manager.getExportedCustomDirectEventTypeConstants()
  }
}
