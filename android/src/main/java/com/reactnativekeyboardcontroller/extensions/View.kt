package com.reactnativekeyboardcontroller.extensions

import android.annotation.SuppressLint
import android.graphics.Rect
import android.os.Build
import android.view.View
import androidx.core.graphics.Insets
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.reactnativekeyboardcontroller.log.Logger

/**
 * Call this every time when using [ViewCompat.setOnApplyWindowInsetsListener]
 * to ensure that insets are always received.
 * @see https://stackoverflow.com/a/61909205/9272042
 */
@SuppressLint("ObsoleteSdkInt")
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
@SuppressLint("ObsoleteSdkInt")
fun View.copyBoundsInWindow(rect: Rect) {
  if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    if (isAttachedToWindow) {
      rect.set(0, 0, width, height)
      getLocationInWindow(tmpIntArr)
      rect.offset(tmpIntArr[0], tmpIntArr[1])
    } else {
      Logger.w("View.copyBoundsInWindow", "Can not copy bounds as view is not attached to window")
    }
  }
}

val View.screenLocation get(): IntArray {
  val point = IntArray(2)
  getLocationOnScreen(point)

  return point
}

/**
 * Safely replaces status bar insets so that when we edge-to-edge mode gets disabled/enabled
 * the app content is not jumping/resizing a window.
 * */
@Suppress("DEPRECATION")
fun View.replaceStatusBarInsets(
  insets: WindowInsetsCompat,
  isStatusBarTranslucent: Boolean,
  active: Boolean,
): WindowInsetsCompat {
  if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
    val sysBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
    val navBars = insets.getInsets(WindowInsetsCompat.Type.navigationBars())
    val ime = insets.getInsets(WindowInsetsCompat.Type.ime())
    val adjustedTop = if (isStatusBarTranslucent) 0 else sysBars.top
    // pick bottom: use IME if present, otherwise nav bar bottom (respect translucency)
    val bottomFromImeOrNav = if (ime.bottom > 0) ime.bottom else navBars.bottom
    val adjustedInsets =
      WindowInsetsCompat
        .Builder(insets)
        .setInsets(
          WindowInsetsCompat.Type.systemBars(),
          Insets.of(sysBars.left, adjustedTop, sysBars.right, if (active) sysBars.bottom else bottomFromImeOrNav),
        ).build()

    return ViewCompat.onApplyWindowInsets(this, adjustedInsets)
  } else {
    val defaultInsets = ViewCompat.onApplyWindowInsets(this, insets)

    return defaultInsets.replaceSystemWindowInsets(
      defaultInsets.systemWindowInsetLeft,
      if (isStatusBarTranslucent) 0 else defaultInsets.systemWindowInsetTop,
      defaultInsets.systemWindowInsetRight,
      defaultInsets.systemWindowInsetBottom,
    )
  }
}
