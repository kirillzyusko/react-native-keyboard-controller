package com.reactnativekeyboardcontroller.views.overlay

import android.view.MotionEvent
import android.view.ViewGroup
import com.facebook.react.uimanager.JSPointerDispatcher
import com.facebook.react.uimanager.events.EventDispatcher

/**
 * Compat layer for `JSPointerDispatcher` interface for RN < 0.72
 */
class JSPointerDispatcherCompat(
  private val viewGroup: ViewGroup,
) : JSPointerDispatcher(viewGroup) {
  private val handleMotionEventMethod: Method? by lazy {
    try {
      // Try to get the 3-parameter method (for RN >= 0.72)
      JSPointerDispatcher::class.java.getMethod(
        "handleMotionEvent",
        MotionEvent::class.java,
        EventDispatcher::class.java,
        Boolean::class.javaPrimitiveType,
      )
    } catch (_: NoSuchMethodException) {
      try {
        // Fallback to 2-parameter method (for RN < 0.72)
        JSPointerDispatcher::class.java.getMethod(
          "handleMotionEvent",
          MotionEvent::class.java,
          EventDispatcher::class.java,
        )
      } catch (_: NoSuchMethodException) {
        null
      }
    }
  }

  fun handleMotionEventCompat(
    event: MotionEvent?,
    eventDispatcher: EventDispatcher?,
    isCapture: Boolean,
  ) {
    handleMotionEventMethod?.let { method ->
      val parameters =
        if (method.parameterCount == 3) {
          arrayOf(event, eventDispatcher, isCapture)
        } else {
          arrayOf(event, eventDispatcher)
        }
      method.invoke(this, *parameters)
    }
  }
}
