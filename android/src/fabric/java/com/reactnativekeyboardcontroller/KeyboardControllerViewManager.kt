package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.KeyboardControllerViewManagerDelegate
import com.facebook.react.viewmanagers.KeyboardControllerViewManagerInterface
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.managers.KeyboardControllerViewManagerImpl
import com.reactnativekeyboardcontroller.views.EdgeToEdgeReactViewGroup

class KeyboardControllerViewManager(mReactContext: ReactApplicationContext) :
  ReactViewManager(),
  KeyboardControllerViewManagerInterface<ReactViewGroup> {
  private val manager = KeyboardControllerViewManagerImpl(mReactContext)
  private val mDelegate = KeyboardControllerViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<ReactViewGroup?> {
    return mDelegate
  }

  override fun getName(): String = KeyboardControllerViewManagerImpl.NAME

  override fun createViewInstance(context: ThemedReactContext): ReactViewGroup {
    return manager.createViewInstance(context)
  }

  @ReactProp(name = "statusBarTranslucent")
  override fun setStatusBarTranslucent(view: ReactViewGroup, value: Boolean) {
    return manager.setStatusBarTranslucent(view as EdgeToEdgeReactViewGroup, value)
  }

  @ReactProp(name = "navigationBarTranslucent")
  override fun setNavigationBarTranslucent(view: ReactViewGroup, value: Boolean) {
    return manager.setNavigationBarTranslucent(view as EdgeToEdgeReactViewGroup, value)
  }

  @ReactProp(name = "enabled")
  override fun setEnabled(view: ReactViewGroup, value: Boolean) {
    return manager.setEnabled(view as EdgeToEdgeReactViewGroup, value)
  }

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
    return manager.getExportedCustomDirectEventTypeConstants()
  }
}
