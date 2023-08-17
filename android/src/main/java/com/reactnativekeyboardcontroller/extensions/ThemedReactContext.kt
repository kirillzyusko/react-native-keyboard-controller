package com.reactnativekeyboardcontroller.extensions

import android.view.View
import com.facebook.react.uimanager.ThemedReactContext

val ThemedReactContext.rootView: View?
  get() = this.currentActivity?.window?.decorView?.rootView
