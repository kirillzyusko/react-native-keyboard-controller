package com.reactnativekeyboardcontroller

import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.reactnativekeyboardcontroller.modules.StatusBarManagerCompatModuleImpl

class StatusBarManagerCompatModule(
  mReactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(mReactContext) {
  private val module = StatusBarManagerCompatModuleImpl(mReactContext)

  override fun getName(): String = StatusBarManagerCompatModuleImpl.NAME

  @ReactMethod
  private fun setHidden(hidden: Boolean) {
    module.setHidden(hidden)
  }

  @ReactMethod
  @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
  private fun setColor(
    color: Int,
    animated: Boolean,
  ) {
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
