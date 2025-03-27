package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.KeyboardToolbarExcludeViewManagerDelegate
import com.facebook.react.viewmanagers.KeyboardToolbarExcludeViewManagerInterface
import com.reactnativekeyboardcontroller.managers.KeyboardToolbarExcludeViewManagerImpl
import com.reactnativekeyboardcontroller.views.KeyboardToolbarExcludeReactViewGroup
import com.reactnativekeyboardcontroller.views.overlay.OverKeyboardHostView

class KeyboardToolbarExcludeViewManager(
  mReactContext: ReactApplicationContext,
) : ViewGroupManager<KeyboardToolbarExcludeReactViewGroup>(),
  KeyboardToolbarExcludeViewManagerInterface<OverKeyboardHostView> {
  private val manager = KeyboardToolbarExcludeViewManagerImpl(mReactContext)
  private val mDelegate = KeyboardToolbarExcludeViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<KeyboardToolbarExcludeReactViewGroup> = mDelegate

  override fun getName(): String = KeyboardToolbarExcludeViewManagerImpl.NAME

  override fun createViewInstance(context: ThemedReactContext): KeyboardToolbarExcludeReactViewGroup =
    manager.createViewInstance(context)
}
