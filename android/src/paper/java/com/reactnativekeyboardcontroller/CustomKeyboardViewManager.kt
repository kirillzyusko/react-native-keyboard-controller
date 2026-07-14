package com.reactnativekeyboardcontroller

import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.reactnativekeyboardcontroller.managers.CustomKeyboardViewManagerImpl
import com.reactnativekeyboardcontroller.views.customkeyboard.CustomKeyboardHostShadowNode
import com.reactnativekeyboardcontroller.views.customkeyboard.CustomKeyboardHostView

class CustomKeyboardViewManager : ViewGroupManager<CustomKeyboardHostView>() {
  private val manager = CustomKeyboardViewManagerImpl()

  override fun getName(): String = CustomKeyboardViewManagerImpl.NAME

  override fun createViewInstance(reactContext: ThemedReactContext): CustomKeyboardHostView =
    manager.createViewInstance(reactContext)

  override fun createShadowNodeInstance(): LayoutShadowNode = CustomKeyboardHostShadowNode()

  override fun getShadowNodeClass(): Class<out LayoutShadowNode> = CustomKeyboardHostShadowNode::class.java

  @ReactProp(name = "enabled")
  fun setEnabled(
    view: CustomKeyboardHostView,
    value: Boolean,
  ) {
    manager.setEnabled(view, value)
  }
}
