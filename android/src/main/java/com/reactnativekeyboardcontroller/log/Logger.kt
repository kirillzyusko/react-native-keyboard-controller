package com.reactnativekeyboardcontroller.log

import android.util.Log
import com.reactnativekeyboardcontroller.BuildConfig

object Logger {
  private val enabled = BuildConfig.DEBUG

  fun i(
    tag: String?,
    message: String,
    throwable: Throwable? = null,
  ) {
    if (enabled) {
      Log.i(tag, message, throwable)
    }
  }

  fun w(
    tag: String?,
    message: String,
    throwable: Throwable? = null,
  ) {
    if (enabled) {
      Log.w(tag, message, throwable)
    }
  }
}
