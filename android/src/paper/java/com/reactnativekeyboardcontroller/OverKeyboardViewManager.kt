package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.reactnativekeyboardcontroller.managers.OverKeyboardViewManagerImpl
import com.reactnativekeyboardcontroller.views.overlay.OverKeyboardHostShadowNode
import com.reactnativekeyboardcontroller.views.overlay.OverKeyboardHostView

class OverKeyboardViewManager(mReactContext: ReactApplicationContext) : ViewGroupManager<OverKeyboardHostView>() {
  private val manager = OverKeyboardViewManagerImpl(mReactContext)

  override fun getName(): String = OverKeyboardViewManagerImpl.NAME

  override fun createViewInstance(reactContext: ThemedReactContext): OverKeyboardHostView {
    return manager.createViewInstance(reactContext)
  }

  override fun createShadowNodeInstance(): LayoutShadowNode = OverKeyboardHostShadowNode()

  override fun getShadowNodeClass(): Class<out LayoutShadowNode> =
    OverKeyboardHostShadowNode::class.java

  @ReactProp(name = "visible")
  fun setVisible(view: OverKeyboardHostView, value: Boolean) {
    manager.setVisible(view, value)
  }
}
