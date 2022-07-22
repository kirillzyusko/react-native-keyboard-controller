package com.reactnativekeyboardcontroller

import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

class KeyboardControllerModule(private val mReactContext: ReactApplicationContext) : NativeKeyboardControllerSpec(mReactContext) {
  private val module = KeyboardControllerModuleImpl(mReactContext)

  override fun getName(): String = KeyboardControllerModuleImpl.NAME

  override fun setInputMode(mode: Double) {
    module.setInputMode(mode.toInt())
  }

  override fun setDefaultMode() {
    module.setDefaultMode()
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
