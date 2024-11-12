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
  fun handleMotionEventCompat(
    event: MotionEvent?,
    eventDispatcher: EventDispatcher?,
    isCapture: Boolean,
  ) {
    try {
      // Try to get the method with 3 parameters (for RN >= 0.72)
      val method =
        JSPointerDispatcher::class.java.getMethod(
          "handleMotionEvent",
          MotionEvent::class.java,
          EventDispatcher::class.java,
          Boolean::class.javaPrimitiveType,
        )
      method.invoke(this, event, eventDispatcher, isCapture)
    } catch (_: NoSuchMethodException) {
      // Fallback to 2-parameter version (for RN < 0.72)
      val method =
        JSPointerDispatcher::class.java.getMethod(
          "handleMotionEvent",
          MotionEvent::class.java,
          EventDispatcher::class.java,
        )
      method.invoke(this, event, eventDispatcher)
    }
  }
}
