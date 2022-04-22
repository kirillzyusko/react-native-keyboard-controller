package com.reactnativekeyboardcontroller

import android.view.WindowManager
import androidx.core.view.WindowCompat
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

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun enable() {
    UiThreadUtil.runOnUiThread {
      mReactContext.currentActivity?.let {
        WindowCompat.setDecorFitsSystemWindows(
          it.window,
          false
        )
      }
    }
  }

  private fun setSoftInputMode(mode: Int) {
    UiThreadUtil.runOnUiThread {
      mReactContext.currentActivity?.window?.setSoftInputMode(mode)
    }
  }
}
