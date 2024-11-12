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
    val method =
      try {
        JSPointerDispatcher::class.java.getMethod(
          "handleMotionEvent",
          MotionEvent::class.java,
          EventDispatcher::class.java,
          Boolean::class.javaPrimitiveType,
        )
      } catch (e: NoSuchMethodException) {
        JSPointerDispatcher::class.java.getMethod(
          "handleMotionEvent",
          MotionEvent::class.java,
          EventDispatcher::class.java,
        )
      }
    method.invoke(this, event, eventDispatcher, isCapture)
  }
}
