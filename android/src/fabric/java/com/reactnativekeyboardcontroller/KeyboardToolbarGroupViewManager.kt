package com.reactnativekeyboardcontroller

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.viewmanagers.KeyboardToolbarGroupViewManagerInterface
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.managers.KeyboardToolbarGroupViewManagerImpl
import com.reactnativekeyboardcontroller.views.KeyboardToolbarGroupReactViewGroup

class KeyboardToolbarGroupViewManager :
  ReactViewManager(),
  KeyboardToolbarGroupViewManagerInterface<ReactViewGroup> {
  private val manager = KeyboardToolbarGroupViewManagerImpl()

  override fun getName(): String = KeyboardToolbarGroupViewManagerImpl.NAME

  override fun createViewInstance(context: ThemedReactContext): KeyboardToolbarGroupReactViewGroup =
    manager.createViewInstance(context)
}
