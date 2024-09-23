package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.OverKeyboardViewManagerDelegate
import com.facebook.react.viewmanagers.OverKeyboardViewManagerInterface
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.managers.OverKeyboardViewManagerImpl
import com.reactnativekeyboardcontroller.views.overlay.OverKeyboardHostShadowNode
import com.reactnativekeyboardcontroller.views.overlay.OverKeyboardHostView

class OverKeyboardViewManager(mReactContext: ReactApplicationContext) :
  ReactViewManager(),
  OverKeyboardViewManagerInterface<ReactViewGroup> {
  private val manager = OverKeyboardViewManagerImpl(mReactContext)
  private val mDelegate = OverKeyboardViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<ReactViewGroup?> {
    return mDelegate
  }

  override fun getName(): String = OverKeyboardViewManagerImpl.NAME

  override fun createViewInstance(context: ThemedReactContext): OverKeyboardHostView {
    return manager.createViewInstance(context)
  }

  override fun createShadowNodeInstance(): LayoutShadowNode = OverKeyboardHostShadowNode()

  override fun getShadowNodeClass(): Class<out LayoutShadowNode> =
    OverKeyboardHostShadowNode::class.java

  @ReactProp(name = "visible")
  override fun setVisible(view: ReactViewGroup?, value: Boolean) {
    manager.setVisible(view as OverKeyboardHostView, value)
  }
}
