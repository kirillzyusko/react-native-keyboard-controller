package com.reactnativekeyboardcontroller

import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

class KeyboardControllerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private val mDefaultMode: Int = reactContext.currentActivity?.window?.attributes?.softInputMode ?: WindowManager.LayoutParams.SOFT_INPUT_STATE_UNSPECIFIED

  override fun getName(): String = "KeyboardController"

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun setInputMode(mode: Int) {
    setSoftInputMode(mode)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun setDefaultMode() {
    setSoftInputMode(mDefaultMode)
  }

  private fun setSoftInputMode(mode: Int) {
    UiThreadUtil.runOnUiThread {
      reactContext.currentActivity?.window?.setSoftInputMode(mode)
    }
  }
}
