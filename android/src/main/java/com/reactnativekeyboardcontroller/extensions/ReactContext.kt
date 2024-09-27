package com.reactnativekeyboardcontroller.extensions

import android.view.View
import android.view.ViewGroup
import com.facebook.react.bridge.ReactContext

val ReactContext.rootView: View?
  get() =
    this.currentActivity
      ?.window
      ?.decorView
      ?.rootView

val ReactContext.content: ViewGroup?
  get() =
    this.currentActivity?.window?.decorView?.rootView?.findViewById(
      androidx.appcompat.R.id.action_bar_root,
    )
