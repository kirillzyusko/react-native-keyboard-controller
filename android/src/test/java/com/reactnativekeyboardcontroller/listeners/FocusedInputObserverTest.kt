package com.reactnativekeyboardcontroller.listeners

import android.content.Context
import android.view.View
import androidx.test.core.app.ApplicationProvider
import com.facebook.react.bridge.BridgeReactContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner

@RunWith(RobolectricTestRunner::class)
class FocusedInputObserverTest {
  @Test
  fun `uses event propagation view surface ID`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val reactApplicationContext = BridgeReactContext(context)
    val themedReactContext = ThemedReactContext(reactApplicationContext, context, "test", SURFACE_ID)
    val modalRootView = View(context)
    val eventPropagationView =
      ReactViewGroup(themedReactContext).apply {
        id = FABRIC_VIEW_ID
      }
    val observer = FocusedInputObserver(modalRootView, eventPropagationView, themedReactContext)

    assertEquals(SURFACE_ID, observer.surfaceId)

    observer.destroy()
  }

  private companion object {
    const val FABRIC_VIEW_ID = 2
    const val SURFACE_ID = 42
  }
}
