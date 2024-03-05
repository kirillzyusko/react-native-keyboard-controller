package com.reactnativekeyboardcontroller.views

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.graphics.PixelFormat
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.Button
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup

@SuppressLint("ViewConstructor")
class OverKeyboardViewGroup(private val reactContext: ThemedReactContext) : ReactViewGroup(reactContext) {
  private var windowManager: WindowManager = reactContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager
  private var view: View = View(reactContext).apply {
    layoutParams = LayoutParams(
      LayoutParams.MATCH_PARENT,
      LayoutParams.MATCH_PARENT // Height in pixels
    )
    setBackgroundColor(Color.argb(128, 255, 0, 0))
  }
  private var hostView: View? = null

  init {

  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()

    windowManager.removeView(hostView)
  }

  override fun addView(child: View?, index: Int, params: LayoutParams?) {
    hostView = child
    val layoutParams = WindowManager.LayoutParams(
      WindowManager.LayoutParams.MATCH_PARENT, // Width
      WindowManager.LayoutParams.MATCH_PARENT, // Height in pixels
      // This type ensures it floats over other application windows but under system windows
      WindowManager.LayoutParams.TYPE_APPLICATION_PANEL,
      // Ensures touches outside the view pass through to other windows
      WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
      PixelFormat.TRANSLUCENT
    )

    // Now add the view to the WindowManager
    windowManager.addView(child, layoutParams)
  }
}
