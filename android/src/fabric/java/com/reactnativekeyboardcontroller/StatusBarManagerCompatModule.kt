package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.reactnativekeyboardcontroller.modules.StatusBarManagerCompatModuleImpl

class StatusBarManagerCompatModule(
  mReactContext: ReactApplicationContext,
) : NativeStatusBarManagerCompatSpec(mReactContext) {
  private val module = StatusBarManagerCompatModuleImpl(mReactContext)

  override fun getName(): String = StatusBarManagerCompatModuleImpl.NAME

  override fun setHidden(hidden: Boolean) {
    module.setHidden(hidden)
  }

  override fun setColor(
    color: Double,
    animated: Boolean,
  ) {
    module.setColor(color.toInt(), animated)
  }

  override fun setTranslucent(translucent: Boolean) {
    module.setTranslucent(translucent)
  }

  override fun setStyle(style: String) {
    module.setStyle(style)
  }
}
