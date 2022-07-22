package com.reactnativekeyboardcontroller

import android.animation.ArgbEvaluator
import android.animation.ValueAnimator
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

class StatusBarManagerCompatModule(private val mReactContext: ReactApplicationContext) : ReactContextBaseJavaModule(mReactContext) {
  private val module = StatusBarManagerCompatImpl(mReactContext)

  override fun getName(): String = StatusBarManagerCompatImpl.NAME

  @ReactMethod
  private fun setHidden(hidden: Boolean) {
    module.setHidden(hidden)
  }

  @ReactMethod
  private fun setColor(color: Int, animated: Boolean) {
    module.setColor(color, animated)
  }

  @ReactMethod
  private fun setTranslucent(translucent: Boolean) {
    module.setTranslucent(translucent)
  }

  @ReactMethod
  private fun setStyle(style: String) {
    module.setStyle(style)
  }
}
