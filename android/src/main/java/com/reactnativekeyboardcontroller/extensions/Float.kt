package com.reactnativekeyboardcontroller.extensions

import android.content.res.Resources

val Float.dp: Int
  get() = (this / Resources.getSystem().displayMetrics.density).toInt()
val Float.px: Int
  get() = (this * Resources.getSystem().displayMetrics.density).toInt()
