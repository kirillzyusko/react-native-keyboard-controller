package com.reactnativekeyboardcontroller.modules

import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil

class KeyboardControllerModuleImpl(private val mReactContext: ReactApplicationContext) {
  private val mDefaultMode: Int = getCurrentMode()

  fun setInputMode(mode: Int) {
    setSoftInputMode(mode)
  }

  fun setDefaultMode() {
    setSoftInputMode(mDefaultMode)
  }

  private fun setSoftInputMode(mode: Int) {
    UiThreadUtil.runOnUiThread {
      if (getCurrentMode() != mode) {
        mReactContext.currentActivity?.window?.setSoftInputMode(mode)
      }
    }
  }

  private fun getCurrentMode(): Int {
    return mReactContext
      .currentActivity
      ?.window
      ?.attributes
      ?.softInputMode
      ?: WindowManager.LayoutParams.SOFT_INPUT_STATE_UNSPECIFIED
  }

  companion object {
    const val NAME = "KeyboardController"
  }
}
