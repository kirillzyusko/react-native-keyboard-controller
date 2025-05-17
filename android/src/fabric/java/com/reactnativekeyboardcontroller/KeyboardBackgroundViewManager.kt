package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.KeyboardBackgroundViewManagerDelegate
import com.facebook.react.viewmanagers.KeyboardBackgroundViewManagerInterface
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.managers.KeyboardBackgroundViewManagerImpl
import com.reactnativekeyboardcontroller.views.background.KeyboardBackgroundViewGroup

class KeyboardBackgroundViewManager(
  mReactContext: ReactApplicationContext,
) : ReactViewManager(),
  KeyboardBackgroundViewManagerInterface<ReactViewGroup> {
  private val manager = KeyboardBackgroundViewManagerImpl(mReactContext)
  private val mDelegate = KeyboardBackgroundViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<ReactViewGroup> = mDelegate

  override fun getName(): String = KeyboardBackgroundViewManagerImpl.NAME

  override fun createViewInstance(context: ThemedReactContext): KeyboardBackgroundViewGroup =
    manager.createViewInstance(context)
}
