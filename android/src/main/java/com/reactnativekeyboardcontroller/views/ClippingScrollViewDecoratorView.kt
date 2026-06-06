package com.reactnativekeyboardcontroller.views

import android.annotation.SuppressLint
import android.view.View
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
  private var appliedContentInsetPx = 0
  private var contentViewBaseBottom = 0
  private var decoratedContentView: ViewGroup? = null
  private var isApplyingContentInset = false
  private val contentLayoutListener =
    View.OnLayoutChangeListener { view, _, _, _, bottom, _, _, _, _ ->
      if (isApplyingContentInset) {
        return@OnLayoutChangeListener
      }

      val contentView = view as? ViewGroup ?: return@OnLayoutChangeListener

      contentViewBaseBottom = bottom
      applyContentInset(contentView, appliedContentInsetPx)
    }

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

  @Suppress("detekt:UnusedParameter")
  fun setApplyWorkaroundForContentInsetHitTestBug(value: Boolean) {
    // iOS-only workaround; no-op on Android
  }

  private fun decorateScrollView() {
    val scrollView = findScrollView(this) ?: return

    scrollView.clipToPadding = false

    val newTopInsetPx = insetTop.toFloat().px.toInt()

    // Translate the content view as a whole — this keeps FlatList's
    // virtualizer calculations correct (it reads layout positions,
    // not translationY).
    val contentView = scrollView.getChildAt(0) as? ViewGroup ?: return
    contentView.translationY = newTopInsetPx.toFloat()
    trackContentView(contentView)

    scrollView.setPadding(
      scrollView.paddingLeft,
      scrollView.paddingTop,
      scrollView.paddingRight,
      0,
    )

    // Extend the real child bottom instead of ScrollView padding. Android's
    // ScrollView.canScrollVertically() ignores padding-created range, which
    // prevents child-started drags when the content itself is shorter than the
    // viewport.
    applyContentInset(
      contentView,
      (insetBottom + insetTop).toFloat().px.toInt(),
    )

    // scroll by the delta to keep content visually in place
    val delta = newTopInsetPx - appliedTopInsetPx
    if (delta != 0) {
      scrollView.scrollBy(0, delta)
    }

    appliedTopInsetPx = newTopInsetPx
  }

  private fun findScrollView(view: View?): ScrollView? {
    var result: ScrollView? = null

    if (view is ScrollView) {
      result = view
    } else if (view is ViewGroup) {
      var i = 0
      while (i < view.childCount && result == null) {
        result = findScrollView(view.getChildAt(i))
        i++
      }
    }

    return result
  }

  private fun trackContentView(contentView: ViewGroup) {
    if (decoratedContentView === contentView) {
      return
    }

    decoratedContentView?.removeOnLayoutChangeListener(contentLayoutListener)
    decoratedContentView = contentView
    contentViewBaseBottom = contentView.bottom
    contentView.addOnLayoutChangeListener(contentLayoutListener)
  }

  private fun applyContentInset(
    contentView: ViewGroup,
    insetPx: Int,
  ) {
    appliedContentInsetPx = insetPx

    val targetBottom = contentViewBaseBottom + insetPx
    if (contentView.bottom == targetBottom) {
      return
    }

    isApplyingContentInset = true
    try {
      contentView.bottom = targetBottom
    } finally {
      isApplyingContentInset = false
    }
  }
}
