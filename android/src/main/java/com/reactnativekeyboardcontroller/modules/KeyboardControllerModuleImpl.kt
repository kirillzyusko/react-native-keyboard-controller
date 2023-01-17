package com.reactnativekeyboardcontroller.modules

import android.view.View
import android.view.WindowManager
import android.webkit.WebView
import android.widget.ScrollView
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.uimanager.UIManagerModule


class KeyboardControllerModuleImpl(private val mReactContext: ReactApplicationContext) {
  private val mDefaultMode: Int = mReactContext.currentActivity?.window?.attributes?.softInputMode ?: WindowManager.LayoutParams.SOFT_INPUT_STATE_UNSPECIFIED

  fun setInputMode(mode: Int) {
    setSoftInputMode(mode)
  }

  fun setDefaultMode() {
    setSoftInputMode(mDefaultMode)
  }

  fun registerForScrollEvents(tag: Int) {
    val uiManagerModule: UIManagerModule? =
      mReactContext.getNativeModule(UIManagerModule::class.java)
    val scrollView = uiManagerModule?.resolveView(tag) as ScrollView
    scrollView.setOnScrollChangeListener { _: View, scrollX: Int, scrollY: Int, _: Int, oldScrollY: Int ->
      println("Scrolled to $scrollX, $scrollY $oldScrollY")
    }
  }

  private fun setSoftInputMode(mode: Int) {
    UiThreadUtil.runOnUiThread {
      mReactContext.currentActivity?.window?.setSoftInputMode(mode)
    }
  }

  companion object {
    const val NAME = "KeyboardController"
  }
}
