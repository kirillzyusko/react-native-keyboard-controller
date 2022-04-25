package com.reactnativekeyboardcontroller

import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

class KeyboardControllerModule(private val mReactContext: ReactApplicationContext) : ReactContextBaseJavaModule(mReactContext) {
  private val mDefaultMode: Int = mReactContext.currentActivity?.window?.attributes?.softInputMode ?: WindowManager.LayoutParams.SOFT_INPUT_STATE_UNSPECIFIED

  override fun getName(): String = "KeyboardController"

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun setInputMode(mode: Int) {
    setSoftInputMode(mode)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun setDefaultMode() {
    setSoftInputMode(mDefaultMode)
  }

  @ReactMethod
  fun addListener(eventName: String?) {
    /* Required for RN built-in Event Emitter Calls. */
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
    /* Required for RN built-in Event Emitter Calls. */
  }

  private fun setSoftInputMode(mode: Int) {
    UiThreadUtil.runOnUiThread {
      mReactContext.currentActivity?.window?.setSoftInputMode(mode)
    }
  }
}
