package com.reactnativekeyboardcontroller.listeners

import android.content.Context
import android.text.TextWatcher
import android.widget.EditText
import androidx.test.core.app.ApplicationProvider
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.BridgeReactContext
import com.facebook.react.bridge.JavaOnlyMap
import com.facebook.react.bridge.JavaScriptModule
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.traversal.FocusedInputHolder
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertSame
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.Implementation
import org.robolectric.annotation.Implements
import org.robolectric.util.ReflectionHelpers
import org.robolectric.util.ReflectionHelpers.ClassParameter
import java.lang.reflect.Proxy

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [33], manifest = Config.NONE, shadows = [ArgumentsShadow::class, UIManagerHelperShadow::class])
class FocusedInputObserverTest {
  @Test
  fun `attaching to an already focused input initializes the holder`() {
    val (root, input) = createFocusedRoot()
    FocusedInputHolder.set(null)
    val observer = createObserver(root)

    assertSame(input, FocusedInputHolder.get())
    observer.destroy()
  }

  @Test
  fun `returning window restores its input without replacing text subscriptions`() {
    val (root, input) = createFocusedRoot()
    val observer = createObserver(root)
    val subscriptions = input.textSubscriptions
    assertTrue(subscriptions > 0)
    val layouts = UIManagerHelperShadow.dispatchedEvents
    val otherWindowInput = EditText(root.context)
    FocusedInputHolder.set(otherWindowInput)

    dispatchWindowFocus(root, false)
    assertSame(otherWindowInput, FocusedInputHolder.get())

    dispatchWindowFocus(root, true)
    assertSame(input, FocusedInputHolder.get())
    assertEquals(subscriptions, input.textSubscriptions)
    assertEquals(layouts + 1, UIManagerHelperShadow.dispatchedEvents)

    dispatchWindowFocus(root, true)
    assertEquals(subscriptions, input.textSubscriptions)
    assertEquals(layouts + 1, UIManagerHelperShadow.dispatchedEvents)

    observer.destroy()
    FocusedInputHolder.set(otherWindowInput)
    dispatchWindowFocus(root, true)
    assertSame(otherWindowInput, FocusedInputHolder.get())
  }

  @Test
  fun `returning window without an input clears the other windows holder`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val root = ReactViewGroup(context)
    val observer = createObserver(root)
    FocusedInputHolder.set(EditText(context))

    dispatchWindowFocus(root, true)

    assertNull(FocusedInputHolder.get())
    observer.destroy()
  }

  private fun createFocusedRoot(): Pair<ReactViewGroup, CountingEditText> {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val root = ReactViewGroup(context).apply { id = 2 }
    val input = CountingEditText(context).apply { id = 1 }
    root.addView(input)
    input.requestFocus()
    return root to input
  }

  private fun createObserver(root: ReactViewGroup): FocusedInputObserver {
    val reactContext =
      object : BridgeReactContext(root.context) {
        override fun <T : JavaScriptModule> getJSModule(jsInterface: Class<T>): T? = null
      }
    return FocusedInputObserver(root, root, ThemedReactContext(reactContext, root.context))
  }

  private fun dispatchWindowFocus(
    root: ReactViewGroup,
    hasFocus: Boolean,
  ) {
    ReflectionHelpers.callInstanceMethod<Unit>(
      root.viewTreeObserver,
      "dispatchOnWindowFocusChange",
      ClassParameter.from(Boolean::class.javaPrimitiveType, hasFocus),
    )
  }

  private class CountingEditText(
    context: Context,
  ) : EditText(context) {
    var textSubscriptions = 0

    override fun addTextChangedListener(watcher: TextWatcher?) {
      textSubscriptions += 1
      super.addTextChangedListener(watcher)
    }
  }
}

@Implements(Arguments::class)
@Suppress("detekt:UtilityClassWithPublicConstructor") // Robolectric creates shadow instances reflectively.
class ArgumentsShadow {
  companion object {
    @JvmStatic
    @Implementation
    fun createMap(): WritableMap = JavaOnlyMap()
  }
}

@Implements(UIManagerHelper::class)
@Suppress("detekt:UtilityClassWithPublicConstructor") // Robolectric creates shadow instances reflectively.
class UIManagerHelperShadow {
  companion object {
    var dispatchedEvents = 0

    @JvmStatic
    @Implementation
    @Suppress("detekt:UnusedParameter")
    fun getEventDispatcherForReactTag(
      context: ReactContext,
      viewId: Int,
    ): EventDispatcher =
      Proxy.newProxyInstance(
        EventDispatcher::class.java.classLoader,
        arrayOf(EventDispatcher::class.java),
      ) { _, method, _ ->
        if (method.name == "dispatchEvent") {
          dispatchedEvents += 1
        }
        null
      } as EventDispatcher
  }
}
