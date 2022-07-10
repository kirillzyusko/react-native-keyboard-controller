package com.reactnativekeyboardcontroller

import android.annotation.SuppressLint
import androidx.core.view.WindowCompat
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup

@SuppressLint("ViewConstructor")
class EdgeToEdgeReactViewGroup(private val reactContext: ThemedReactContext) : ReactViewGroup(reactContext) {
  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    reactContext.currentActivity?.let {
      WindowCompat.setDecorFitsSystemWindows(
        it.window,
        false
      )
    }
  }
}
