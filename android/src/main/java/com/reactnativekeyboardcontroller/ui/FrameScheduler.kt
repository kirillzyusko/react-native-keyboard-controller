package com.reactnativekeyboardcontroller.ui

import android.view.Choreographer

/**
 * A class that schedules a callback to be executed on each frame using the Android Choreographer framework.
 *
 * @property callback The function to be executed on each frame.
 */
class FrameScheduler(
  private val callback: () -> Unit,
) {
  /**
   * A FrameCallback instance responsible for running the provided callback
   * on each frame and rescheduling itself for the next frame.
   */
  private val frameCallback =
    object : Choreographer.FrameCallback {
      override fun doFrame(frameTimeNanoSeconds: Long) {
        // Execute the callback
        callback()

        // Re-post the callback to the next frame
        Choreographer.getInstance().postFrameCallback(this)
      }
    }

  /**
   * Starts the frame callback, which will continuously call the provided function
   * on every frame until `stop()` is called.
   */
  fun start() {
    Choreographer.getInstance().postFrameCallback(frameCallback)
  }

  /**
   * Stops the frame callback from being invoked further. The function will no longer
   * be called on each frame until `start()` is invoked again.
   */
  fun stop() {
    Choreographer.getInstance().removeFrameCallback(frameCallback)
  }
}
