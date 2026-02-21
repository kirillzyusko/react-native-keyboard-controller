package com.reactnativekeyboardcontroller.views

import android.annotation.SuppressLint
import android.view.ViewGroup
import android.widget.ScrollView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.extensions.px

@SuppressLint("ViewConstructor")
class ClippingScrollViewDecoratorView(
  val reactContext: ThemedReactContext,
) : ReactViewGroup(reactContext) {
  private var insetBottom = 0.0
  private var insetTop = 0.0
  private var appliedTopInsetPx = 0

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    decorateScrollView()
  }

  fun setContentInsetBottom(value: Double) {
    insetBottom = value
    decorateScrollView()
  }

  fun setContentInsetTop(value: Double) {
    insetTop = value
    decorateScrollView()
  }

  private fun decorateScrollView() {
    val scrollView = getChildAt(0) as? ScrollView ?: return

    scrollView.clipToPadding = false

    val newTopInsetPx = insetTop.toFloat().px.toInt()

    // Translate the content view as a whole — this keeps FlatList's
    // virtualizer calculations correct (it reads layout positions,
    // not translationY).
    val contentView = scrollView.getChildAt(0) as? ViewGroup ?: return
    (contentView.getChildAt(0) as? ViewGroup)?.translationY = newTopInsetPx.toFloat()

    scrollView.setPadding(
      scrollView.paddingLeft,
      scrollView.paddingTop,
      scrollView.paddingRight,
      // pass accumulated value — visually both top and bottom insets
      // extend the scroll range via bottom padding
      (insetBottom + insetTop).toFloat().px.toInt(),
    )

    // scroll by the delta to keep content visually in place
    val delta = newTopInsetPx - appliedTopInsetPx
    if (delta != 0) {
      scrollView.scrollBy(0, delta)
    }

    appliedTopInsetPx = newTopInsetPx
  }
}
