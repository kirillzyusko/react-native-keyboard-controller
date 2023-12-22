package com.reactnativekeyboardcontroller.modules

import android.content.Context
import android.view.View
import android.view.WindowManager
import android.view.inputmethod.InputMethodManager
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

  fun dismiss() {
    val activity = mReactContext.currentActivity
    val view: View? = activity?.currentFocus

    if (view != null) {
      val imm = activity.getSystemService(Context.INPUT_METHOD_SERVICE) as? InputMethodManager
      imm?.hideSoftInputFromWindow(view.windowToken, 0)
    }
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
