package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.managers.KeyboardGestureAreaViewManagerImpl
import com.reactnativekeyboardcontroller.views.KeyboardGestureAreaReactViewGroup

class KeyboardGestureAreaViewManager(
  mReactContext: ReactApplicationContext,
) : ReactViewManager() {
  private val manager = KeyboardGestureAreaViewManagerImpl(mReactContext)

  override fun getName(): String = KeyboardGestureAreaViewManagerImpl.NAME

  override fun createViewInstance(reactContext: ThemedReactContext): KeyboardGestureAreaReactViewGroup =
    manager.createViewInstance(reactContext)

  @ReactProp(name = "offset")
  fun setInterpolator(
    view: KeyboardGestureAreaReactViewGroup,
    offset: Double,
  ) {
    manager.setOffset(view, offset)
  }

  @ReactProp(name = "interpolator")
  fun setInterpolator(
    view: KeyboardGestureAreaReactViewGroup,
    interpolator: String,
  ) {
    manager.setInterpolator(view, interpolator)
  }

  @ReactProp(name = "showOnSwipeUp")
  fun setScrollKeyboardOnScreenWhenNotVisible(
    view: KeyboardGestureAreaReactViewGroup,
    value: Boolean,
  ) {
    manager.setScrollKeyboardOnScreenWhenNotVisible(view, value)
  }

  @ReactProp(name = "enableSwipeToDismiss")
  fun setScrollKeyboardOffScreenWhenVisible(
    view: KeyboardGestureAreaReactViewGroup,
    value: Boolean,
  ) {
    manager.setScrollKeyboardOffScreenWhenVisible(view, value)
  }

  @Suppress("detekt:UnusedParameter")
  @ReactProp(name = "textInputNativeID")
  fun setTextInputNativeID(
    view: KeyboardGestureAreaReactViewGroup,
    value: String,
  ) {
    // no-op
  }
}
