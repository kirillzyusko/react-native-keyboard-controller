package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.KeyboardGestureAreaManagerDelegate
import com.facebook.react.viewmanagers.KeyboardGestureAreaManagerInterface
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.managers.KeyboardGestureAreaViewManagerImpl
import com.reactnativekeyboardcontroller.views.KeyboardGestureAreaReactViewGroup

class KeyboardGestureAreaViewManager(mReactContext: ReactApplicationContext) :
  ReactViewManager(),
  KeyboardGestureAreaManagerInterface<ReactViewGroup> {
  private val manager = KeyboardGestureAreaViewManagerImpl(mReactContext)
  private val mDelegate = KeyboardGestureAreaManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<ReactViewGroup?> {
    return mDelegate
  }

  override fun getName(): String = KeyboardGestureAreaViewManagerImpl.NAME

  override fun createViewInstance(context: ThemedReactContext): KeyboardGestureAreaReactViewGroup {
    return manager.createViewInstance(context)
  }

  @ReactProp(name = "interpolator")
  override fun setInterpolator(view: ReactViewGroup, value: String?) {
    manager.setInterpolator(view as KeyboardGestureAreaReactViewGroup, value ?: "linear")
  }

  @ReactProp(name = "showOnSwipeUp")
  override fun setShowOnSwipeUp(view: ReactViewGroup, value: Boolean) {
    manager.setScrollKeyboardOnScreenWhenNotVisible(view as KeyboardGestureAreaReactViewGroup, value)
  }

  @ReactProp(name = "enableSwipeToDismiss")
  override fun setEnableSwipeToDismiss(view: ReactViewGroup?, value: Boolean) {
    manager.setScrollKeyboardOffScreenWhenVisible(view as KeyboardGestureAreaReactViewGroup, value)
  }
}
