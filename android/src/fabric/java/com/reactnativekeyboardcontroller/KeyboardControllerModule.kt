package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext

class KeyboardControllerModule(mReactContext: ReactApplicationContext) : NativeKeyboardControllerSpec(mReactContext) {
  private val module = KeyboardControllerModuleImpl(mReactContext)

  override fun getName(): String = KeyboardControllerModuleImpl.NAME

  override fun setInputMode(mode: Double) {
    module.setInputMode(mode.toInt())
  }

  override fun setDefaultMode() {
    module.setDefaultMode()
  }

  override fun addListener(eventName: String?) {
    /* Required for RN built-in Event Emitter Calls. */
  }

  override fun removeListeners(count: Double) {
    /* Required for RN built-in Event Emitter Calls. */
  }
}
