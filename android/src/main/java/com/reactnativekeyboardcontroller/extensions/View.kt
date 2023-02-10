package com.reactnativekeyboardcontroller.extensions

import android.os.Build
import android.view.View

/**
 * Call this everytime when using [ViewCompat.setOnApplyWindowInsetsListener]
 * to ensure that insets are always received.
 * @see https://stackoverflow.com/a/61909205/9272042
 */
fun View.requestApplyInsetsWhenAttached() {
  // https://chris.banes.dev/2019/04/12/insets-listeners-to-layouts/
  if (Build.VERSION.SDK_INT > Build.VERSION_CODES.KITKAT && isAttachedToWindow) {
    // We're already attached, just request as normal
    requestApplyInsets()

  } else {
    // We're not attached to the hierarchy, add a listener to request when we are
    addOnAttachStateChangeListener(object : View.OnAttachStateChangeListener {
      override fun onViewAttachedToWindow(v: View) {
        v.removeOnAttachStateChangeListener(this)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT_WATCH) {
          v.requestApplyInsets()
        }
      }

      override fun onViewDetachedFromWindow(v: View) = Unit
    })
  }
}
