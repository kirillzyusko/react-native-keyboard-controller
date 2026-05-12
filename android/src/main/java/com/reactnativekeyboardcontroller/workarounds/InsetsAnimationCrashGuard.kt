package com.reactnativekeyboardcontroller.workarounds

import android.os.Handler
import android.os.Looper
import android.util.Log

private const val TAG = "KeyboardController"

/**
 * Workaround for an Android framework race in `InsetsController` where two rapid
 * IME show/hide animations within the same frame can cause:
 *
 *   java.lang.IllegalStateException: Can't change insets on an animation that is cancelled.
 *     at android.view.InsetsAnimationControlImpl.setInsetsAndAlpha(...)
 *     at android.view.InsetsController$InternalAnimationControlListener.lambda$onReady$0(...)
 *
 * The first request's pre-draw `onReady` runnable is already queued when a second
 * request cancels the underlying impl, but the runnable still fires on the next
 * frame and touches the cancelled impl.
 *
 * See: https://github.com/kirillzyusko/react-native-keyboard-controller/issues/1456
 *
 * The guard wraps the main `Looper.loop()` in a `try/catch` that swallows ONLY
 * this exact exception (matched by type, message and top stack frame). Anything
 * else is rethrown.
 */
internal object InsetsAnimationCrashGuard {
  private var installed = false

  fun install() {
    if (installed) return
    installed = true

    Handler(Looper.getMainLooper()).post {
      while (true) {
        try {
          Looper.loop()
          return@post
        } catch (e: Throwable) {
          if (isKnownFrameworkRace(e)) {
            Log.w(TAG, "Swallowed Android IME inset animation race (issue #1456)", e)
            // continue → re-enter Looper.loop() and keep processing messages
          } else {
            throw e
          }
        }
      }
    }
  }

  private fun isKnownFrameworkRace(e: Throwable): Boolean {
    if (e !is IllegalStateException) return false
    if (e.message?.contains("animation that is cancelled") != true) return false
    val top = e.stackTrace.firstOrNull() ?: return false
    return top.className == "android.view.InsetsAnimationControlImpl" &&
      top.methodName == "setInsetsAndAlpha"
  }
}
