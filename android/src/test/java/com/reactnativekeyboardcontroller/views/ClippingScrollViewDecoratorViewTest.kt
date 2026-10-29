package com.reactnativekeyboardcontroller.views

import android.content.Context
import android.os.SystemClock
import android.view.MotionEvent
import android.view.View
import android.view.ViewConfiguration
import android.widget.FrameLayout
import android.widget.ScrollView
import androidx.core.widget.NestedScrollView
import androidx.test.core.app.ApplicationProvider
import com.facebook.react.bridge.BridgeReactContext
import com.facebook.react.uimanager.ThemedReactContext
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [33], manifest = Config.NONE)
class ClippingScrollViewDecoratorViewTest {
  @Test
  fun `first drag on short clickable content scrolls without exceeding the padded range`() {
    val (decorator, scrollView) = createScrollView(contentHeight = 600, paddingBottom = 400)

    // This is why the interception workaround is needed in the first place.
    assertFalse(scrollView.canScrollVertically(1))

    val offsets = dragUp(decorator, scrollView)

    assertTrue("A drag starting on the child must scroll", offsets.max() > 0)
    assertTrue("The first drag must respect the real range", offsets.all { it in 0..200 })
    assertEquals(200, scrollView.scrollY)
    assertEquals(600, scrollView.getChildAt(0).height)
  }

  @Test
  fun `short content without a padding-created range stays still`() {
    val (decorator, scrollView) = createScrollView(contentHeight = 600, paddingBottom = 0)

    assertTrue(dragUp(decorator, scrollView).all { it == 0 })
    assertEquals(600, scrollView.getChildAt(0).height)
  }

  @Test
  fun `nested scroll view also starts a padding-only drag and respects its real range`() {
    val (decorator, scrollView) = createScrollView(contentHeight = 600, paddingBottom = 400, nested = true)

    val offsets = dragUp(decorator, scrollView)

    assertTrue("A nested drag starting on the child must scroll", offsets.max() > 0)
    assertTrue("The nested drag must respect the real range", offsets.all { it in 0..200 })
    assertEquals(200, scrollView.scrollY)
    assertEquals(600, scrollView.getChildAt(0).height)
  }

  @Test
  fun `content that already overflows keeps its normal scroll range`() {
    val (decorator, scrollView) = createScrollView(contentHeight = 1200, paddingBottom = 400)

    assertTrue(scrollView.canScrollVertically(1))
    assertTrue(dragUp(decorator, scrollView).all { it in 0..800 })
    assertTrue(scrollView.scrollY > 0)
    assertEquals(1200, scrollView.getChildAt(0).height)
  }

  @Test
  fun `a second drag from offset 10 consumes only the remaining 90 pixels`() {
    assertInterruptedDrag(nested = false)
  }

  @Test
  fun `a nested second drag from offset 10 consumes only the remaining 90 pixels`() {
    assertInterruptedDrag(nested = true)
  }

  @Test
  fun `a new drag after returning to zero can bootstrap again`() {
    val (decorator, scrollView) = createScrollView(contentHeight = 200, paddingBottom = 700)
    dragTenPixels(decorator, scrollView)
    assertEquals(10, scrollView.scrollY)
    dragUp(decorator, scrollView, listOf(100, 110, 120, 130, 130))
    assertEquals(0, scrollView.scrollY)

    val offsets = dragUp(decorator, scrollView, listOf(180) + (170 downTo -30 step 10) + -30)

    assertTrue(offsets.all { it in 0..100 })
    assertEquals(100, scrollView.scrollY)
  }

  @Test
  fun `a one pixel padding-created range cannot be exceeded on the first move`() {
    val (decorator, scrollView) = createScrollView(contentHeight = 200, paddingBottom = 601)

    val offsets = dragUp(decorator, scrollView, listOf(180) + (170 downTo -30 step 10) + -30)

    assertTrue("The real scroll range is only one pixel", offsets.all { it in 0..1 })
    assertEquals(1, scrollView.scrollY)
  }

  @Test
  fun `a drag without a clickable child also respects a one pixel range`() {
    val (decorator, scrollView) = createScrollView(contentHeight = 200, paddingBottom = 601, clickable = false)

    val offsets = dragUp(decorator, scrollView, listOf(180, 100, 0, 0))

    assertTrue("Even a large first movement must use the real range", offsets.all { it in 0..1 })
    assertEquals(1, scrollView.scrollY)
  }

  private fun assertInterruptedDrag(nested: Boolean) {
    val (decorator, scrollView) = createScrollView(contentHeight = 200, paddingBottom = 700, nested = nested)

    dragTenPixels(decorator, scrollView)
    assertEquals("The first gesture stops at exactly 10 pixels", 10, scrollView.scrollY)

    val offsets = dragUp(decorator, scrollView, listOf(180) + (170 downTo -30 step 10) + -30)

    assertTrue("The second gesture stays within the original 100-pixel range", offsets.all { it in 10..100 })
    assertEquals("Only 90 more pixels can be consumed", 100, scrollView.scrollY)
  }

  private fun dragTenPixels(
    decorator: ClippingScrollViewDecoratorView,
    scrollView: android.view.ViewGroup,
  ) {
    val interceptY = 180 - ViewConfiguration.get(decorator.context).scaledTouchSlop - 1

    dragUp(decorator, scrollView, listOf(180, interceptY, interceptY - 10, interceptY - 10))
  }

  private fun createScrollView(
    contentHeight: Int,
    paddingBottom: Int,
    nested: Boolean = false,
    clickable: Boolean = true,
  ): Pair<ClippingScrollViewDecoratorView, android.view.ViewGroup> {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val themedContext = ThemedReactContext(BridgeReactContext(context), context)
    val decorator = ClippingScrollViewDecoratorView(themedContext)
    val scrollView = if (nested) NestedScrollView(context) else ScrollView(context)
    val content = View(context).apply { isClickable = clickable }

    scrollView.overScrollMode = View.OVER_SCROLL_NEVER
    scrollView.clipToPadding = false
    scrollView.setPadding(0, 0, 0, paddingBottom)
    scrollView.addView(content, FrameLayout.LayoutParams(400, contentHeight))
    decorator.addView(scrollView)

    val widthSpec = View.MeasureSpec.makeMeasureSpec(400, View.MeasureSpec.EXACTLY)
    val heightSpec = View.MeasureSpec.makeMeasureSpec(800, View.MeasureSpec.EXACTLY)
    decorator.measure(widthSpec, heightSpec)
    decorator.layout(0, 0, 400, 800)
    scrollView.measure(widthSpec, heightSpec)
    scrollView.layout(0, 0, 400, 800)
    // React Native lays out the content independently of Android's ScrollView.
    content.measure(widthSpec, View.MeasureSpec.makeMeasureSpec(contentHeight, View.MeasureSpec.EXACTLY))
    content.layout(0, 0, 400, contentHeight)

    return decorator to scrollView
  }

  private fun dragUp(
    decorator: ClippingScrollViewDecoratorView,
    scrollView: android.view.ViewGroup,
    positions: List<Int> = listOf(500) + (490 downTo 100 step 10) + 100,
  ): List<Int> {
    val downTime = SystemClock.uptimeMillis()
    val offsets = mutableListOf<Int>()

    positions.forEachIndexed { index, y ->
      val action =
        when (index) {
          0 -> MotionEvent.ACTION_DOWN
          positions.lastIndex -> MotionEvent.ACTION_UP
          else -> MotionEvent.ACTION_MOVE
        }
      val event = MotionEvent.obtain(downTime, downTime + index * 16L, action, 200f, y.toFloat(), 0)

      try {
        decorator.dispatchTouchEvent(event)
        offsets.add(scrollView.scrollY)
      } finally {
        event.recycle()
      }
    }

    return offsets
  }
}
