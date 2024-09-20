package com.reactnativekeyboardcontroller.extensions

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Point
import android.os.Build
import android.view.Display
import android.view.WindowManager
import android.view.WindowMetrics

@SuppressLint("ObsoleteSdkInt")
@Suppress("DEPRECATION")
fun Context.getDisplaySize(): Point {
  val size = Point()

  if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
    // For API level 30 (Android 11) and above
    val windowManager = getSystemService(WindowManager::class.java)
    val windowMetrics: WindowMetrics = windowManager.currentWindowMetrics

    val bounds = windowMetrics.bounds
    size.x = bounds.width()
    size.y = bounds.height()
  } else {
    val windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
    val display: Display = windowManager.defaultDisplay

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
      display.getRealSize(size) // API level 17 and above
    } else {
      // Fallback for API level < 17
      size.x = display.width
      size.y = display.height
    }
  }

  return size
}
