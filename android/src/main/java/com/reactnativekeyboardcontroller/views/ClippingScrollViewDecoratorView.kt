package com.reactnativekeyboardcontroller.views

import android.annotation.SuppressLint
import android.widget.ScrollView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.extensions.px

@SuppressLint("ViewConstructor")
class ClippingScrollViewDecoratorView(
  val reactContext: ThemedReactContext,
) : ReactViewGroup(reactContext) {
  private var insetBottom = 0.0

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    decorateScrollView()
  }

  fun setContentInsetBottom(value: Double) {
    insetBottom = value
    decorateScrollView()
  }

  private fun decorateScrollView() {
    val scrollView = getChildAt(0) as? ScrollView

    scrollView?.clipToPadding = false
    scrollView?.setPadding(
      scrollView.paddingLeft,
      scrollView.paddingTop,
      scrollView.paddingRight,
      insetBottom.toFloat().px.toInt(),
    )
  }
}
