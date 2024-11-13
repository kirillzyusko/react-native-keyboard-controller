package com.reactnativekeyboardcontroller.views.overlay

import android.view.MotionEvent
import android.view.ViewGroup
import com.facebook.react.uimanager.JSPointerDispatcher
import com.facebook.react.uimanager.events.EventDispatcher
import java.lang.reflect.Method

/**
 * Compat layer for `JSPointerDispatcher` interface for RN < 0.72
 */
class JSPointerDispatcherCompat(
  viewGroup: ViewGroup,
) : JSPointerDispatcher(viewGroup) {
  private val handleMotionEventMethod: Method? by lazy {
    try {
      // Try to get the 3-parameter method (for RN >= 0.72)
      JSPointerDispatcher::class.java.getMethod(
        HANDLE_MOTION_EVENT,
        MotionEvent::class.java,
        EventDispatcher::class.java,
        Boolean::class.javaPrimitiveType,
      )
    } catch (_: NoSuchMethodException) {
      try {
        // Fallback to 2-parameter method (for RN < 0.72)
        JSPointerDispatcher::class.java.getMethod(
          HANDLE_MOTION_EVENT,
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
      if (method.parameterCount == RN_72_PARAMS_COUNT) {
        method.invoke(this, event, eventDispatcher, isCapture)
      } else {
        method.invoke(this, event, eventDispatcher)
      }
    }
  }

  companion object {
    private const val HANDLE_MOTION_EVENT = "handleMotionEvent"
    private const val RN_72_PARAMS_COUNT = 3
  }
}
