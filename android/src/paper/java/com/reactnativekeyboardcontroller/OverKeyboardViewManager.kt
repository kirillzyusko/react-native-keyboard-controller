package com.reactnativekeyboardcontroller

import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.reactnativekeyboardcontroller.managers.OverKeyboardViewManagerImpl
import com.reactnativekeyboardcontroller.views.overlay.OverKeyboardHostShadowNode
import com.reactnativekeyboardcontroller.views.overlay.OverKeyboardHostView

class OverKeyboardViewManager : ViewGroupManager<OverKeyboardHostView>() {
  private val manager = OverKeyboardViewManagerImpl()

  override fun getName(): String = OverKeyboardViewManagerImpl.NAME

  override fun createViewInstance(reactContext: ThemedReactContext): OverKeyboardHostView =
    manager.createViewInstance(reactContext)

  override fun createShadowNodeInstance(): LayoutShadowNode = OverKeyboardHostShadowNode()

  override fun getShadowNodeClass(): Class<out LayoutShadowNode> = OverKeyboardHostShadowNode::class.java

  @ReactProp(name = "visible")
  fun setVisible(
    view: OverKeyboardHostView,
    value: Boolean,
  ) {
    manager.setVisible(view, value)
  }
}
