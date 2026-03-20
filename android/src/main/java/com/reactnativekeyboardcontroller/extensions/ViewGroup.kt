package com.reactnativekeyboardcontroller.extensions

import android.view.ViewGroup

fun ViewGroup?.removeSelf() {
  this ?: return
  val parent = parent as? ViewGroup ?: return

  parent.removeView(this)
}
