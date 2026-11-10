package com.reactnativekeyboardcontroller.extensions

import android.view.ViewGroup

@Suppress("UNUSED_PARAMETER")
internal fun ViewGroup.syncContentInsetState(topInsetPx: Int) {
  // Paper has no Fabric measurement state; keep support for React Native 0.65.
}
