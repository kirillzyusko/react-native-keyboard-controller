package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.reactnativekeyboardcontroller.modules.KeyboardControllerModuleImpl

class KeyboardControllerModule(mReactContext: ReactApplicationContext) : ReactContextBaseJavaModule(mReactContext) {
  private val module = KeyboardControllerModuleImpl(mReactContext)

  override fun getName(): String = KeyboardControllerModuleImpl.NAME

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun setInputMode(mode: Int) {
    module.setInputMode(mode)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun setDefaultMode() {
    module.setDefaultMode()
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun registerForScrollEvents(tag: Int) {
    module.registerForScrollEvents(tag)
  }

  @ReactMethod
  fun addListener(eventName: String?) {
    /* Required for RN built-in Event Emitter Calls. */
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
    /* Required for RN built-in Event Emitter Calls. */
  }
}
