package com.reactnativekeyboardcontroller.views

import android.annotation.SuppressLint
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.ScrollView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.extensions.px
import kotlin.math.max

@SuppressLint("ViewConstructor")
class ClippingScrollViewDecoratorView(
  val reactContext: ThemedReactContext,
) : ReactViewGroup(reactContext) {
  private var insetBottom = 0.0
  private var insetTop = 0.0
  private var appliedTopInsetPx = 0
  private var paddingScrollWorkaroundActive = false

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    decorateScrollView()
  }

  override fun dispatchTouchEvent(event: MotionEvent): Boolean {
    val scrollView = findScrollView(this)

    if (scrollView == null) {
      return super.dispatchTouchEvent(event)
    }

    if (event.actionMasked == MotionEvent.ACTION_DOWN) {
      paddingScrollWorkaroundActive = shouldUsePaddingScrollWorkaround(scrollView, event)
    }

    val handled =
      if (paddingScrollWorkaroundActive) {
        dispatchWithExpandedContentRange(scrollView, event)
      } else {
        super.dispatchTouchEvent(event)
      }

    if (
      event.actionMasked == MotionEvent.ACTION_UP ||
      event.actionMasked == MotionEvent.ACTION_CANCEL
    ) {
      paddingScrollWorkaroundActive = false
    }

    return handled
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

  private fun shouldUsePaddingScrollWorkaround(
    scrollView: ScrollView,
    event: MotionEvent,
  ): Boolean {
    val contentView = scrollView.getChildAt(0) ?: return false
    val viewportHeight =
      scrollView.height - scrollView.paddingTop - scrollView.paddingBottom
    val paddingCreatesScrollRange = contentView.height > viewportHeight

    return scrollView.scrollY == 0 &&
      paddingCreatesScrollRange &&
      !scrollView.canScrollVertically(1) &&
      isTouchInScrollContent(scrollView, event)
  }

  private fun dispatchWithExpandedContentRange(
    scrollView: ScrollView,
    event: MotionEvent,
  ): Boolean {
    val contentView = scrollView.getChildAt(0)
    val originalBottom = contentView?.bottom ?: 0
    val expandedBottom =
      max(originalBottom, scrollView.height + scrollView.scrollY + MIN_SCROLL_RANGE_PX)

    if (contentView == null || expandedBottom == originalBottom) {
      return super.dispatchTouchEvent(event)
    }

    return try {
      contentView.bottom = expandedBottom
      super.dispatchTouchEvent(event)
    } finally {
      contentView.bottom = originalBottom
    }
  }

  private fun isTouchInScrollContent(
    scrollView: ScrollView,
    event: MotionEvent,
  ): Boolean {
    val contentView = scrollView.getChildAt(0) ?: return false
    val thisLocation = IntArray(COORDINATES_SIZE)
    val scrollViewLocation = IntArray(COORDINATES_SIZE)

    getLocationOnScreen(thisLocation)
    scrollView.getLocationOnScreen(scrollViewLocation)

    val x = event.x + thisLocation[0] - scrollViewLocation[0]
    val y = event.y + thisLocation[1] - scrollViewLocation[1]
    val scrollY = scrollView.scrollY

    return !(
      y < contentView.top - scrollY ||
        y >= contentView.bottom - scrollY ||
        x < contentView.left ||
        x >= contentView.right
    )
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

  companion object {
    private const val COORDINATES_SIZE = 2
    private const val MIN_SCROLL_RANGE_PX = 2
  }
}
