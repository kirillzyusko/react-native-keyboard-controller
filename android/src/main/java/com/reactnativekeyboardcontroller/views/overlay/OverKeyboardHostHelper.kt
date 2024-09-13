package com.reactnativekeyboardcontroller.views.overlay

import android.content.Context
import android.graphics.Point
import android.view.WindowManager

/** Helper class for OverKeyboardView. */
internal object OverKeyboardHostHelper {
  @Suppress("DEPRECATION")
  @JvmStatic
  fun getModalHostSize(context: Context): Point {
    val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    val size = Point()
    windowManager.defaultDisplay.getRealSize(size)
    return size
  }
}
