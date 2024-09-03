package com.reactnativekeyboardcontroller.log

import android.util.Log
import com.reactnativekeyboardcontroller.BuildConfig

object Logger {
  private const val IS_ENABLED = BuildConfig.DEBUG

  fun i(tag: String?, message: String, throwable: Throwable? = null) {
    if (IS_ENABLED) {
      Log.i(tag, message, throwable)
    }
  }

  fun w(tag: String?, message: String, throwable: Throwable? = null) {
    if (IS_ENABLED) {
      Log.w(tag, message, throwable)
    }
  }
}
