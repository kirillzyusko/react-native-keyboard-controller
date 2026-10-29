package com.reactnativekeyboardcontroller.listeners

import android.content.Context
import android.widget.EditText
import android.widget.LinearLayout
import androidx.test.core.app.ApplicationProvider
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.BridgeReactContext
import com.facebook.react.bridge.JavaOnlyMap
import com.facebook.react.bridge.JavaScriptModule
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.traversal.FocusedInputHolder
import org.junit.Assert.assertNotSame
import org.junit.Assert.assertSame
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.Implementation
import org.robolectric.annotation.Implements

// `Arguments.createMap()` loads the React Native JNI library, which isn't available in unit tests
@Implements(Arguments::class)
object ShadowArguments {
  @JvmStatic
  @Implementation
  fun createMap(): WritableMap = JavaOnlyMap()
}

// the React instance isn't set up in unit tests, so there are no JS modules to emit events to
class TestReactContext(
  context: Context,
) : BridgeReactContext(context) {
  override fun <T : JavaScriptModule> getJSModule(jsInterface: Class<T>): T? = null
}

@RunWith(RobolectricTestRunner::class)
@Config(shadows = [ShadowArguments::class], instrumentedPackages = ["com.facebook.react.bridge"])
class FocusedInputObserverTest {
  private lateinit var reactContext: ThemedReactContext
  private lateinit var root: LinearLayout
  private lateinit var input: EditText

  @Before
  fun setUp() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    reactContext = ThemedReactContext(TestReactContext(context), context)
    root = LinearLayout(reactContext)
    input = EditText(reactContext)
    root.addView(input)
    // reset the holder to an input that isn't part of the tested hierarchy
    FocusedInputHolder.set(EditText(reactContext))
  }

  private fun createObserver() =
    FocusedInputObserver(
      view = root,
      eventPropagationView = ReactViewGroup(reactContext),
      context = reactContext,
    )

  @Test
  fun `input focused before the observer is created is not observed by default`() {
    input.requestFocus()

    createObserver()

    assertNotSame(input, FocusedInputHolder.get())
  }

  @Test
  fun `observeFocusedInput() picks up input focused before the observer was created`() {
    input.requestFocus()

    createObserver().observeFocusedInput()

    assertSame(input, FocusedInputHolder.get())
  }

  @Test
  fun `observeFocusedInput() picks up the same input again`() {
    input.requestFocus()
    val observer = createObserver()
    observer.observeFocusedInput()
    // another window's input took over while this one kept view focus
    FocusedInputHolder.set(EditText(reactContext))

    observer.observeFocusedInput()

    assertSame(input, FocusedInputHolder.get())
  }

  @Test
  fun `observeFocusedInput() does nothing without a focused input`() {
    val previous = FocusedInputHolder.get()

    createObserver().observeFocusedInput()

    assertSame(previous, FocusedInputHolder.get())
  }
}
