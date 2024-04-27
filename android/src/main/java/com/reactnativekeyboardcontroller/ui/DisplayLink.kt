package com.reactnativekeyboardcontroller.ui

import android.view.Choreographer

class DisplayLink(private val callback: () -> Unit) {
  private val frameCallback = object : Choreographer.FrameCallback {
    override fun doFrame(frameTimeNanoSeconds: Long) {
      // Execute the callback
      callback()

      // Re-post the callback to the next frame
      Choreographer.getInstance().postFrameCallback(this)
    }
  }

  fun start() {
    Choreographer.getInstance().postFrameCallback(frameCallback)
  }

  fun stop() {
    Choreographer.getInstance().removeFrameCallback(frameCallback)
  }
}
