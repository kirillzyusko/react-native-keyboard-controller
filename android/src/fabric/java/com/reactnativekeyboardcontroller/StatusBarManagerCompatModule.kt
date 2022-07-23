package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext

class StatusBarManagerCompatModule(private val mReactContext: ReactApplicationContext) : NativeStatusBarManagerCompatSpec(mReactContext) {
  private val module = StatusBarManagerCompatImpl(mReactContext)

  override fun getName(): String = StatusBarManagerCompatImpl.NAME

  override fun setHidden(hidden: Boolean) {
    module.setHidden(hidden)
  }

  override fun setColor(color: Double, animated: Boolean) {
    module.setColor(color.toInt(), animated)
  }

  override fun setTranslucent(translucent: Boolean) {
    module.setTranslucent(translucent)
  }

  override fun setStyle(style: String) {
    module.setStyle(style)
  }
}
