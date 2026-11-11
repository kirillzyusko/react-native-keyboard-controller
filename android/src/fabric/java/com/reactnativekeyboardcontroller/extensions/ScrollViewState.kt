package com.reactnativekeyboardcontroller.extensions

import android.view.ViewGroup
import com.facebook.react.views.scroll.ReactScrollViewHelper
import com.facebook.react.views.scroll.ReactScrollViewHelper.HasScrollState
import com.facebook.react.views.scroll.ReactScrollViewHelper.HasStateWrapper

internal fun ViewGroup.syncContentInsetState(topInsetPx: Int) {
  if (this is HasScrollState && this is HasStateWrapper) {
    // Fabric applies this content-only offset after the ScrollView transform.
    // Match the native translation in screen axes, including inverted lists,
    // without shifting the measured viewport or changing virtualizer layout.
    val scrollState = reactScrollViewScrollState
    val contentOffset = (topInsetPx * scaleY).toInt()
    if (scrollState.scrollAwayPaddingTop != contentOffset) {
      scrollState.scrollAwayPaddingTop = contentOffset
      ReactScrollViewHelper.forceUpdateState(this)
    }
  }
}
