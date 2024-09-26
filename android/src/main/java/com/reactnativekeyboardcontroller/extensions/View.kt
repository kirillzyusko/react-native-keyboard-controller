package com.reactnativekeyboardcontroller.extensions

import android.graphics.Rect
import android.os.Build
import android.view.View
import androidx.annotation.RequiresApi
import com.reactnativekeyboardcontroller.log.Logger

/**
 * Call this every time when using [ViewCompat.setOnApplyWindowInsetsListener]
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
    addOnAttachStateChangeListener(
      object : View.OnAttachStateChangeListener {
        override fun onViewAttachedToWindow(v: View) {
          v.removeOnAttachStateChangeListener(this)
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT_WATCH) {
            v.requestApplyInsets()
          }
        }

        override fun onViewDetachedFromWindow(v: View) = Unit
      },
    )
  }
}

private val tmpIntArr = IntArray(2)

/**
 * Function which updates the given [rect] with this view's position and bounds in its window.
 */
@RequiresApi(Build.VERSION_CODES.KITKAT)
fun View.copyBoundsInWindow(rect: Rect) {
  if (isAttachedToWindow) {
    rect.set(0, 0, width, height)
    getLocationInWindow(tmpIntArr)
    rect.offset(tmpIntArr[0], tmpIntArr[1])
  } else {
    Logger.w("View.copyBoundsInWindow", "Can not copy bounds as view is not attached to window")
  }
}

val View.screenLocation get(): IntArray {
  val point = IntArray(2)
  getLocationOnScreen(point)

  return point
}
