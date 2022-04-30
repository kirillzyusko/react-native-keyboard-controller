package com.reactnativekeyboardcontroller

import android.annotation.SuppressLint
import android.view.MotionEvent
import androidx.core.view.WindowCompat
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup

@SuppressLint("ViewConstructor")
class EdgeToEdgeReactViewGroup(private val reactContext: ThemedReactContext) : ReactViewGroup(reactContext) {
  init {
      // reactContext.currentActivity.dispatchTouchEvent()
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    reactContext.currentActivity?.let {
      WindowCompat.setDecorFitsSystemWindows(
        it.window,
        false
      )
    }
  }

  override fun dispatchTouchEvent(ev: MotionEvent?): Boolean {

    // println("222" + ev)

    return super.dispatchTouchEvent(ev)
  }
}
