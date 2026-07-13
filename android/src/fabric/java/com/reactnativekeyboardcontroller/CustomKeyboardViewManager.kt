package com.reactnativekeyboardcontroller

import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.CustomKeyboardViewManagerDelegate
import com.facebook.react.viewmanagers.CustomKeyboardViewManagerInterface
import com.reactnativekeyboardcontroller.managers.CustomKeyboardViewManagerImpl
import com.reactnativekeyboardcontroller.views.customkeyboard.CustomKeyboardHostShadowNode
import com.reactnativekeyboardcontroller.views.customkeyboard.CustomKeyboardHostView

class CustomKeyboardViewManager :
  ViewGroupManager<CustomKeyboardHostView>(),
  CustomKeyboardViewManagerInterface<CustomKeyboardHostView> {
  private val manager = CustomKeyboardViewManagerImpl()
  private val mDelegate = CustomKeyboardViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<CustomKeyboardHostView> = mDelegate

  override fun getName(): String = CustomKeyboardViewManagerImpl.NAME

  override fun createViewInstance(context: ThemedReactContext): CustomKeyboardHostView =
    manager.createViewInstance(context)

  override fun createShadowNodeInstance(): LayoutShadowNode = CustomKeyboardHostShadowNode()

  override fun getShadowNodeClass(): Class<out LayoutShadowNode> = CustomKeyboardHostShadowNode::class.java

  override fun updateState(
    view: CustomKeyboardHostView,
    props: ReactStylesDiffMap,
    stateWrapper: StateWrapper,
  ): Any? {
    view.stateWrapper = stateWrapper
    return null
  }

  @ReactProp(name = "enabled")
  override fun setEnabled(
    view: CustomKeyboardHostView,
    value: Boolean,
  ) {
    manager.setEnabled(view, value)
  }
}
