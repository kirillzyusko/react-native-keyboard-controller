package com.reactnativekeyboardcontroller.views

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.graphics.PixelFormat
import android.view.Gravity
import android.view.View
import android.view.WindowManager
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

  // PopupWindow
  init {
    /*val textView = TextView(reactContext).apply {
      text = "This is a popup!"
      layoutParams = ViewGroup.LayoutParams(
        ViewGroup.LayoutParams.WRAP_CONTENT,
        ViewGroup.LayoutParams.WRAP_CONTENT
      )
    }

    val popup = PopupWindow(reactContext).apply {
      contentView = textView
      backgroundColor = Color.RED
      width = ViewGroup.LayoutParams.WRAP_CONTENT
      height = ViewGroup.LayoutParams.WRAP_CONTENT
      isFocusable = true // Lets taps outside the popup also dismiss it
    }

    popup.showAtLocation(rootView, Gravity.CENTER, 0, 0)*/

    val layoutParams = WindowManager.LayoutParams(
      WindowManager.LayoutParams.MATCH_PARENT, // Width
      WindowManager.LayoutParams.MATCH_PARENT, // Height in pixels
      // This type ensures it floats over other application windows but under system windows
      WindowManager.LayoutParams.TYPE_APPLICATION_PANEL,
      // Ensures touches outside the view pass through to other windows
      WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
      PixelFormat.TRANSLUCENT
    ).apply {
      gravity = Gravity.BOTTOM // Align it at the bottom of the screen
    }

    // Now add the view to the WindowManager
    windowManager.addView(view, layoutParams)
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()

    windowManager.removeView(view)
  }
}
