package com.reactnativekeyboardcontroller.views

import android.annotation.SuppressLint
import android.graphics.Rect
import android.view.MotionEvent
import android.view.VelocityTracker
import android.view.ViewConfiguration
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.KeyboardAnimationController
import com.reactnativekeyboardcontroller.extensions.copyBoundsInWindow
import com.reactnativekeyboardcontroller.interpolators.Interpolator
import com.reactnativekeyboardcontroller.interpolators.IosInterpolator
import com.reactnativekeyboardcontroller.interpolators.LinearInterpolator
import kotlin.math.absoluteValue
import kotlin.math.roundToInt

val interpolators = mapOf("linear" to LinearInterpolator(), "ios" to IosInterpolator())

@SuppressLint("ViewConstructor")
class KeyboardGestureAreaReactViewGroup(reactContext: ThemedReactContext) : ReactViewGroup(reactContext) {
  private var isHandling = false
  private var lastTouchX = 0f
  private var lastTouchY = 0f
  private var lastWindowY = 0
  private var interpolator: Interpolator = LinearInterpolator()

  private val bounds = Rect()

  private val controller = KeyboardAnimationController()

  private var velocityTracker: VelocityTracker? = null

  override fun dispatchTouchEvent(event: MotionEvent?): Boolean {
    if (velocityTracker == null) {
      // Obtain a VelocityTracker if we don't have one yet
      velocityTracker = VelocityTracker.obtain()
    }

    when (event?.action) {
      MotionEvent.ACTION_DOWN -> {
        velocityTracker?.addMovement(event)

        lastTouchX = event.x
        lastTouchY = event.y

        this.copyBoundsInWindow(bounds)
        lastWindowY = bounds.top
      }
      MotionEvent.ACTION_MOVE -> {
        println("Moved by: ${event.y}")
        // Since the view is likely to be translated/moved as the WindowInsetsAnimation
        // progresses, we need to make sure we account for that change in our touch
        // handling. We do that by keeping track of the view's Y position in the window,
        // and detecting the difference between the current bounds.

        this.copyBoundsInWindow(bounds)
        val windowOffsetY = bounds.top - lastWindowY

        // We then make a copy of the MotionEvent, and offset it with the calculated
        // windowOffsetY. We can then pass it to the VelocityTracker.
        val velocityTrackerEvent = MotionEvent.obtain(event)
        velocityTrackerEvent.offsetLocation(0f, windowOffsetY.toFloat())
        velocityTracker?.addMovement(velocityTrackerEvent)

        val dx = velocityTrackerEvent.x - lastTouchX
        val dy = velocityTrackerEvent.y - lastTouchY

        if (!isHandling) {
          // If we're not currently handling the touch gesture, lets check if we should
          // start handling, by seeing if the gesture is majorly vertical, and
          // larger than the touch slop
          isHandling = dy.absoluteValue > dx.absoluteValue &&
            dy.absoluteValue >= ViewConfiguration.get(this.context).scaledTouchSlop
        }

        if (isHandling) {
          if (controller.isInsetAnimationInProgress()) {
            // If we currently have control, we can update the IME insets to 'scroll'
            // the IME in
            println("DiffY: ${dy.roundToInt()}")
            controller.insetBy(dy.roundToInt())
          } else if (
            !controller.isInsetAnimationRequestPending() &&
            shouldStartRequest(
              dy = dy,
              imeVisible = ViewCompat.getRootWindowInsets(this)
                ?.isVisible(WindowInsetsCompat.Type.ime()) == true
            )
          ) {
            // If we don't currently have control (and a request isn't pending),
            // the IME is not shown, the user is scrolling up, and the view can't
            // scroll up any more (i.e. over-scrolling), we can start to control
            // the IME insets
            controller.startControlRequest(this)
          }

          // Lastly we record the event X, Y, and view's Y window position, for the
          // next touch event
          lastTouchY = event.y
          lastTouchX = event.x
          lastWindowY = bounds.top
        }
      }
      MotionEvent.ACTION_UP -> {
        velocityTracker?.addMovement(event)

        // Calculate the current velocityY, over 1000 milliseconds
        velocityTracker?.computeCurrentVelocity(1000)
        val velocityY = velocityTracker?.yVelocity

        // If we received a ACTION_UP event, end any current WindowInsetsAnimation passing
        // in the calculated Y velocity
        controller.animateToFinish(velocityY)

        // Reset our touch handling state
        reset()
      }
      MotionEvent.ACTION_CANCEL -> {
        // If we received a ACTION_CANCEL event, cancel any current WindowInsetsAnimation
        controller.cancel()
        // Reset our touch handling state
        reset()
      }
    }

    return super.dispatchTouchEvent(event)
  }

  fun setInterpolator(interpolator: String) {
    this.interpolator = interpolators[interpolator] ?: LinearInterpolator()
  }

  /**
   * Resets all of our internal state.
   */
  private fun reset() {
    // Clear all of our internal state
    isHandling = false
    lastTouchX = 0f
    lastTouchY = 0f
    lastWindowY = 0
    bounds.setEmpty()

    velocityTracker?.recycle()
    velocityTracker = null
  }

  /**
   * Returns true if the given [dy], [IME visibility][imeVisible], and constructor options
   * support a IME animation request.
   */
  private fun shouldStartRequest(dy: Float, imeVisible: Boolean) = when {
    // If the user is scroll up, return true if scrollImeOnScreenWhenNotVisible is true, and
    // the IME is not currently visible
    dy < 0 -> !imeVisible && false
    // If the user is scroll down, start the request if scrollImeOffScreenWhenVisible is true,
    // and the IME is currently visible
    dy > 0 -> imeVisible && true
    // Otherwise, return false
    else -> false
  }
}
