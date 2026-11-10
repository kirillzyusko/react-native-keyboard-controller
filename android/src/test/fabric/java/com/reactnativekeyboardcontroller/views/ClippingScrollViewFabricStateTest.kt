package com.reactnativekeyboardcontroller.views

import android.content.Context
import android.content.res.Resources
import android.view.View
import android.widget.FrameLayout
import android.widget.ScrollView
import androidx.test.core.app.ApplicationProvider
import com.facebook.react.bridge.BridgeReactContext
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.scroll.ReactScrollViewHelper.HasScrollState
import com.facebook.react.views.scroll.ReactScrollViewHelper.HasStateWrapper
import com.facebook.react.views.scroll.ReactScrollViewHelper.ReactScrollViewScrollState
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [33], manifest = Config.NONE)
class ClippingScrollViewFabricStateTest {
  @Test
  fun `content inset updates measurement state without moving the viewport`() {
    val (decorator, scrollView) = createScrollView()
    val topBefore = scrollView.top

    decorator.setContentInsetTop(200.0 / Resources.getSystem().displayMetrics.density)

    assertEquals(200, scrollView.reactScrollViewScrollState.scrollAwayPaddingTop)
    assertEquals(200f, scrollView.getChildAt(0).translationY, 0f)
    assertEquals(topBefore, scrollView.top)
  }

  @Test
  fun `inverted content inset uses the visual direction and resets when removed`() {
    val (decorator, scrollView) = createScrollView()
    scrollView.scaleY = -1f

    decorator.setContentInsetTop(200.0 / Resources.getSystem().displayMetrics.density)
    assertEquals(-200, scrollView.reactScrollViewScrollState.scrollAwayPaddingTop)

    decorator.setContentInsetTop(80.0 / Resources.getSystem().displayMetrics.density)
    assertEquals(-80, scrollView.reactScrollViewScrollState.scrollAwayPaddingTop)

    decorator.setContentInsetTop(0.0)
    assertEquals(0, scrollView.reactScrollViewScrollState.scrollAwayPaddingTop)
    assertEquals(0f, scrollView.getChildAt(0).translationY, 0f)
  }

  private fun createScrollView(): Pair<ClippingScrollViewDecoratorView, FabricScrollView> {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val themedContext = ThemedReactContext(BridgeReactContext(context), context)
    val decorator = ClippingScrollViewDecoratorView(themedContext)
    val scrollView = FabricScrollView(context)
    val content = FrameLayout(context)

    scrollView.addView(content, FrameLayout.LayoutParams(400, 1200))
    decorator.addView(scrollView)

    val widthSpec = View.MeasureSpec.makeMeasureSpec(400, View.MeasureSpec.EXACTLY)
    val heightSpec = View.MeasureSpec.makeMeasureSpec(800, View.MeasureSpec.EXACTLY)
    decorator.measure(widthSpec, heightSpec)
    decorator.layout(0, 0, 400, 800)
    scrollView.measure(widthSpec, heightSpec)
    scrollView.layout(0, 0, 400, 800)
    content.measure(widthSpec, View.MeasureSpec.makeMeasureSpec(1200, View.MeasureSpec.EXACTLY))
    content.layout(0, 0, 400, 1200)

    return decorator to scrollView
  }

  private class FabricScrollView(
    context: Context,
  ) : ScrollView(context),
    HasScrollState,
    HasStateWrapper {
    override var reactScrollViewScrollState = ReactScrollViewScrollState()
    override var stateWrapper: StateWrapper? = null
  }
}
