package com.reactnativekeyboardcontroller.extensions

import android.annotation.SuppressLint
import android.graphics.Rect
import android.os.Build
import android.view.View
import android.view.ViewGroup

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

private val tmpIntArr = IntArray(2)

/**
 * Function which updates the given [rect] with this view's position and bounds in its window.
 */
fun View.copyBoundsInWindow(rect: Rect) {
  if (isLaidOut && isAttachedToWindow) {
    rect.set(0, 0, width, height)
    getLocationInWindow(tmpIntArr)
    rect.offset(tmpIntArr[0], tmpIntArr[1])
  } else {
    throw IllegalArgumentException(
      "Can not copy bounds as view is not laid out" +
        " or attached to window"
    )
  }
}

/**
 * Provides access to the hidden ViewGroup#suppressLayout method.
 */
fun ViewGroup.suppressLayoutCompat(suppress: Boolean) {
  if (Build.VERSION.SDK_INT >= 29) {
    suppressLayout(suppress)
  } else {
    hiddenSuppressLayout(this, suppress)
  }
}

/**
 * False when linking of the hidden suppressLayout method has previously failed.
 */
private var tryHiddenSuppressLayout = true

@SuppressLint("NewApi") // Lint doesn't know about the hidden method.
private fun hiddenSuppressLayout(group: ViewGroup, suppress: Boolean) {
  if (tryHiddenSuppressLayout) {
    // Since this was an @hide method made public, we can link directly against it with
    // a try/catch for its absence instead of doing the same through reflection.
    try {
      group.suppressLayout(suppress)
    } catch (e: NoSuchMethodError) {
      tryHiddenSuppressLayout = false
    }
  }
}
