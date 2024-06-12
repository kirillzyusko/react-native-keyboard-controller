package com.reactnativekeyboardcontroller.listeners

import android.view.ViewGroup
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.extensions.content
import com.reactnativekeyboardcontroller.extensions.dp
import com.reactnativekeyboardcontroller.extensions.emitEvent

data class Dimensions(val width: Double, val height: Double)

class WindowDimensionListener(private val context: ThemedReactContext?) {
  private var lastDispatchedDimensions = Dimensions(0.0, 0.0)

  init {
    val content = context?.content

    updateWindowDimensions(content)

    content?.viewTreeObserver?.addOnGlobalLayoutListener {
      updateWindowDimensions(content)
    }
  }

  private fun updateWindowDimensions(content: ViewGroup?) {
    if (content == null) {
      return
    }

    val newDimensions = Dimensions(content.width.toFloat().dp, content.height.toFloat().dp)

    if (newDimensions != lastDispatchedDimensions) {
      lastDispatchedDimensions = newDimensions

      context.emitEvent(
        "KeyboardController::windowDidResize",
        Arguments.createMap().apply {
          putDouble("height", newDimensions.height)
          putDouble("width", newDimensions.width)
        }
      )
    }
  }
}
