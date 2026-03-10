package com.reactnativekeyboardcontroller

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.KeyboardToolbarGroupViewManagerDelegate
import com.facebook.react.viewmanagers.KeyboardToolbarGroupViewManagerInterface
import com.reactnativekeyboardcontroller.managers.KeyboardToolbarGroupViewManagerImpl
import com.reactnativekeyboardcontroller.views.KeyboardToolbarGroupReactViewGroup
import com.reactnativekeyboardcontroller.views.overlay.OverKeyboardHostView

class KeyboardToolbarGroupViewManager :
  ViewGroupManager<KeyboardToolbarGroupReactViewGroup>(),
  KeyboardToolbarGroupViewManagerInterface<OverKeyboardHostView> {
  private val manager = KeyboardToolbarGroupViewManagerImpl()
  private val mDelegate = KeyboardToolbarGroupViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<KeyboardToolbarGroupReactViewGroup> = mDelegate

  override fun getName(): String = KeyboardToolbarGroupViewManagerImpl.NAME

  override fun createViewInstance(context: ThemedReactContext): KeyboardToolbarGroupReactViewGroup =
    manager.createViewInstance(context)
}
