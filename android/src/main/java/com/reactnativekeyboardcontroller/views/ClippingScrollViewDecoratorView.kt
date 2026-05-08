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
  private var boundContentView: ViewGroup? = null

  // Re-run the extension after every Yoga relayout so `child.bottom` (and therefore
  // `computeVerticalScrollRange()`) stays at the extended target as messages stream in.
  // This listener MUST fire before `ReactScrollView.onLayoutChange` does its scrollY
  // clamp (`ReactScrollView` adds itself as a listener in `onChildViewAdded` at
  // ReactScrollView.java:1145 and the clamp at line 1275 uses the pre-extension
  // `child.getHeight()` — so if RN's listener runs first, the scrollY snaps to 0
  // mid-stream as the AI reply arrives). `decorateScrollView()` handles the ordering by
  // removing RN's listener from the content view and re-adding it AFTER ours.
  private val layoutListener =
    View.OnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
      applyInsetExtension()
    }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    decorateScrollView()
  }

  override fun onDetachedFromWindow() {
    boundContentView?.removeOnLayoutChangeListener(layoutListener)
    boundContentView = null
    super.onDetachedFromWindow()
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

    if (boundContentView !== contentView) {
      boundContentView?.removeOnLayoutChangeListener(layoutListener)
      // Install our listener BEFORE ReactScrollView's so that we restore the extended
      // child.bottom before RN's scrollY-clamp listener reads child.getHeight(). The
      // ScrollView itself is the RN listener (it implements OnLayoutChangeListener), so
      // removing + re-adding it puts it behind ours in the invocation order.
      val rnListener = scrollView as? View.OnLayoutChangeListener
      if (rnListener != null) {
        contentView.removeOnLayoutChangeListener(rnListener)
      }
      contentView.addOnLayoutChangeListener(layoutListener)
      if (rnListener != null) {
        contentView.addOnLayoutChangeListener(rnListener)
      }
      boundContentView = contentView
    }

    applyInsetExtension()

    // scroll by the delta to keep content visually in place
    val delta = newTopInsetPx - appliedTopInsetPx
    if (delta != 0) {
      scrollView.scrollBy(0, delta)
    }

    appliedTopInsetPx = newTopInsetPx
  }

  private fun applyInsetExtension() {
    val contentView = boundContentView ?: return
    val scrollView = findScrollView(this) ?: return
    val totalInsetPx = (insetBottom + insetTop).toFloat().px.toInt()
    // Mirror iOS `contentInset.bottom`: maxScrollY should be
    //   max(0, measuredHeight + totalInsetPx - viewport)
    // Extend `child.bottom` directly rather than using `paddingBottom`, because
    // `computeVerticalScrollRange()` is derived from `child.getBottom()` (padding is
    // not part of it). Without this, `canScrollVertically(1)` returns false inside
    // the message area on short content and drags started there aren't intercepted.
    // The guard below defensively clears any residual `paddingBottom` (e.g. from
    // hot-reload of an older build that set it); this class never sets it.
    if (scrollView.paddingBottom != 0) {
      scrollView.setPadding(
        scrollView.paddingLeft,
        scrollView.paddingTop,
        scrollView.paddingRight,
        0,
      )
    }
    val measuredHeight = contentView.measuredHeight
    val expectedBottom = contentView.top + measuredHeight + totalInsetPx
    if (contentView.bottom != expectedBottom) {
      contentView.bottom = expectedBottom
    }
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
}
