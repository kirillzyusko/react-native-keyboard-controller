package com.reactnativekeyboardcontroller.listeners

import android.app.Activity
import android.content.Context
import android.os.Looper
import android.os.SystemClock
import android.view.View
import android.view.ViewTreeObserver
import android.widget.EditText
import android.widget.FrameLayout
import androidx.core.graphics.Insets
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import androidx.test.core.app.ApplicationProvider
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.BridgeReactContext
import com.facebook.react.bridge.JavaOnlyArray
import com.facebook.react.bridge.JavaOnlyMap
import com.facebook.react.bridge.JavaScriptModule
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.interactive.InteractiveKeyboardProvider
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.Robolectric
import org.robolectric.RobolectricTestRunner
import org.robolectric.Shadows.shadowOf
import org.robolectric.annotation.Config
import org.robolectric.annotation.Implementation
import org.robolectric.annotation.Implements
import java.lang.reflect.Proxy
import java.time.Duration

/**
 * Covers the latched-transition deadlock: an insets animation that loses its `onEnd` (the app
 * backgrounding mid-transition) leaves `isTransitioning` latched, which used to block both
 * sync paths in `onApplyWindowInsets` forever. The keyboard height then goes stale and the
 * avoiding UI ends up buried behind, or stranded above, the real keyboard.
 *
 * Event dispatch needs a live React Native runtime, which a unit test does not have. RN's
 * `Arguments` are shadowed with pure-Java collections and the JS module emitter is replaced
 * with a recorder, so emitted events can be asserted; the asserted internal state is always
 * updated before any event is built, keeping the two independent.
 */
@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34], manifest = Config.NONE, shadows = [ShadowArguments::class])
class KeyboardAnimationCallbackTest {
  private lateinit var root: FrameLayout
  private lateinit var input: EditText
  private lateinit var reactContext: RecordingReactContext
  private lateinit var callback: KeyboardAnimationCallback

  @Before
  fun setUp() {
    val controller = Robolectric.buildActivity(Activity::class.java).setup()
    root = FrameLayout(controller.get())
    input = EditText(controller.get())
    root.addView(input)
    controller.get().setContentView(root)

    val appContext = ApplicationProvider.getApplicationContext<Context>()
    reactContext = RecordingReactContext(appContext)
    val themedContext = ThemedReactContext(reactContext, appContext)
    callback =
      KeyboardAnimationCallback(
        eventPropagationView = ReactViewGroup(themedContext),
        view = root,
        context = themedContext,
        config =
          KeyboardAnimationCallbackConfig(
            persistentInsetTypes = WindowInsetsCompat.Type.systemBars(),
            deferredInsetTypes = WindowInsetsCompat.Type.ime(),
            hasTranslucentNavigationBar = false,
          ),
      )
  }

  @Test
  fun `a transition still running keeps the height resync suppressed`() {
    callback.onPrepare(imeAnimation())

    // A real animation is in flight: the resync must not fire mid-animation.
    applyImeInsets(heightPx = 881)

    assertEquals("height must stay untouched mid-animation", 0.0, field("prevKeyboardHeight"))
    assertTrue(field("isTransitioning") as Boolean)
  }

  @Test
  fun `an orphaned transition no longer blocks the height resync`() {
    callback.onPrepare(imeAnimation())

    // The activity was backgrounded mid-animation and `onEnd` never arrived. No real
    // insets animation outlives this window.
    SystemClock.sleep(2_500)

    // The IME changes its own height (e.g. a candidate bar expands) and insets re-dispatch.
    applyImeInsets(heightPx = 881)

    assertEquals("stale height must be resynced from the dispatched insets", 881.0, field("prevKeyboardHeight"))
    assertFalse("a resync must reset the latched transition", field("isTransitioning") as Boolean)
  }

  @Test
  fun `a notification inside the grace window still recovers once it lapses`() {
    callback.onPrepare(imeAnimation())

    // The keyboard settles while the transition is still inside its grace window, then the
    // app backgrounds: the dispatch is ignored and no further notification ever arrives.
    // A real dispatch leaves the settled insets on the root - the recheck reads the window
    // live instead of the insets captured at schedule time. The first idle consumes the
    // traversal Robolectric queues at setup, which would otherwise restage the root empty
    // and overwrite what a real dispatch had settled.
    shadowOf(Looper.getMainLooper()).idleFor(Duration.ofMillis(50))
    stageRootInsets(heightPx = 881)
    runCatching { callback.onApplyWindowInsets(root, visibleImeInsets(heightPx = 881)) }
    assertEquals("inside the grace window the resync stays suppressed", 0.0, field("prevKeyboardHeight"))

    shadowOf(Looper.getMainLooper()).idleFor(Duration.ofMillis(2_300))

    assertEquals(
      "the deferred recheck must resync from the window the ignored insets settled on",
      881.0,
      field("prevKeyboardHeight"),
    )
    assertFalse("the deferred recheck must clear the latched transition", field("isTransitioning") as Boolean)
  }

  @Test
  fun `an animation that still progresses is not treated as orphaned`() {
    callback.onPrepare(imeAnimation())
    SystemClock.sleep(1_500)

    // A slow animation is still delivering frames: 1.5s since onPrepare, but the liveness
    // of a transition is its last progress, not its start.
    runCatching { callback.onProgress(visibleImeInsets(heightPx = 881), listOf(imeAnimation())) }
    SystemClock.sleep(1_200)

    applyImeInsets(heightPx = 881)

    assertEquals("a live animation must keep the resync suppressed", 0.0, field("prevKeyboardHeight"))
    assertTrue("a live animation must keep its transition", field("isTransitioning") as Boolean)
  }

  @Test
  fun `focusing an input clears an orphaned transition`() {
    callback.onPrepare(imeAnimation())
    SystemClock.sleep(2_500)

    dispatchFocus(oldFocus = root, newFocus = input)

    assertFalse("refocusing an input must clear the latched transition", field("isTransitioning") as Boolean)
  }

  @Test
  fun `a focus change during an interactive gesture keeps the transition`() {
    callback.onPrepare(imeAnimation())
    SystemClock.sleep(2_500)

    // The user is mid-gesture: the latch is old, but the keyboard is being driven right now.
    InteractiveKeyboardProvider.isInteractive = true
    dispatchFocus(oldFocus = root, newFocus = input)
    InteractiveKeyboardProvider.isInteractive = false

    assertTrue("a gesture in flight must not be cleared by a focus change", field("isTransitioning") as Boolean)
  }

  @Test
  fun `a focus change while suspended keeps the transition`() {
    callback.onPrepare(imeAnimation())
    SystemClock.sleep(2_500)

    // A modal owns the screen (the callback is suspended): its watcher resyncs on detach.
    callback.suspend(true)
    dispatchFocus(oldFocus = root, newFocus = input)

    assertTrue("a suspended callback must not recover on focus", field("isTransitioning") as Boolean)
  }

  @Test
  fun `a visible keyboard resizes through a stale latch and catches up fully`() {
    // The keyboard settled at 881 and a later resize animation lost its onEnd.
    runCatching { callback.syncKeyboardPosition(881.0, true) }
    stageRootInsets(heightPx = 881)
    callback.onPrepare(imeAnimation())
    runCatching {
      callback.onStart(imeAnimation(), WindowInsetsAnimationCompat.BoundsCompat(Insets.NONE, Insets.NONE))
    }
    SystemClock.sleep(2_500)

    // The IME grew (a candidate bar expanded): the root already reports the new height while
    // the dispatch carries the old one, and prevKeyboardHeight holds the dispatched value.
    // Only the resize branch can act then - if the root staging silently fails, the desync
    // fallback is a no-op (its height already matches) and the latch stays set.
    stageRootInsets(heightPx = 1080)
    runCatching { callback.onApplyWindowInsets(root, visibleImeInsets(heightPx = 881)) }

    assertFalse("the resize path must clear the latched transition", field("isTransitioning") as Boolean)
    assertEquals("both tracked heights must follow the dispatched insets", 881.0, field("prevKeyboardHeight"))
    assertEquals("the persisted height must follow the dispatched insets", 881.0, field("persistentKeyboardHeight"))
  }

  @Test
  fun `a stale recovery replays the show pair so the js state updates`() {
    runCatching { callback.syncKeyboardPosition(881.0, true) }
    stageRootInsets(heightPx = 881)
    callback.onPrepare(imeAnimation())
    SystemClock.sleep(2_500)

    // The IME grew while the transition was orphaned; the recovery catches up to 1080.
    stageRootInsets(heightPx = 1080)
    runCatching { callback.onApplyWindowInsets(root, visibleImeInsets(heightPx = 1080)) }

    assertEquals(
      "state()/useKeyboardState() only listen for keyboardWillShow, so the recovery must replay the pair in show order",
      listOf("KeyboardController::keyboardWillShow", "KeyboardController::keyboardDidShow"),
      reactContext.events.filter { it.second == 1080.0 }.map { it.first },
    )
  }

  @Test
  fun `a sync persists the height the next focus round will emit`() {
    // A unit-test view has no live window insets, so the height arrives explicitly —
    // on a device the same sync reads it from the root insets.
    runCatching { callback.syncKeyboardPosition(1080.0, true) }

    assertEquals(
      "the sync must leave the persisted height at reality, or the legacy focus round re-emits the old one",
      1080.0,
      field("persistentKeyboardHeight"),
    )
  }

  @Test
  fun `an interactive gesture stays protected past the stale window`() {
    callback.onPrepare(imeAnimation())
    SystemClock.sleep(2_500)

    // The user is still dragging the keyboard: the latch is stale, but the gesture is not.
    InteractiveKeyboardProvider.isInteractive = true
    applyImeInsets(heightPx = 881)
    InteractiveKeyboardProvider.isInteractive = false

    assertEquals("a live gesture must keep the resync suppressed", 0.0, field("prevKeyboardHeight"))
  }

  @Test
  fun `a same-height re-show after a close still replays the show pair`() {
    // A real show at 881 followed by a real close: `onEnd` drops the tracked height to 0,
    // but the persisted one keeps the last shown height (it must not update on hide).
    stageRootInsets(heightPx = 881)
    callback.onPrepare(imeAnimation())
    runCatching { callback.onStart(imeAnimation(), WindowInsetsAnimationCompat.BoundsCompat(Insets.NONE, Insets.NONE)) }
    runCatching { callback.onEnd(imeAnimation()) }
    callback.onPrepare(imeAnimation())
    runCatching { callback.onStart(imeAnimation(), WindowInsetsAnimationCompat.BoundsCompat(Insets.NONE, Insets.NONE)) }
    stageHiddenRootInsets()
    runCatching { callback.onEnd(imeAnimation()) }
    reactContext.events.clear()

    // The keyboard re-shows at the very same height and loses its `onStart` to a
    // backgrounding: the transition orphans and the desync recovery syncs, but the
    // persisted height still equals the shown one.
    callback.onPrepare(imeAnimation())
    SystemClock.sleep(2_500)
    stageRootInsets(heightPx = 881)
    runCatching { callback.onApplyWindowInsets(root, visibleImeInsets(heightPx = 881)) }

    assertEquals(
      "state()/useKeyboardState() only update on keyboardWillShow - a re-show at an unchanged height still owes the pair",
      listOf("KeyboardController::keyboardWillShow", "KeyboardController::keyboardDidShow"),
      reactContext.events.map { it.first },
    )
  }

  @Test
  fun `a cancelled transition back to the same height still recovers`() {
    // Fully shown at 881, then a resize transition that drifts away and cancels back to
    // 881 loses its `onEnd`: every tracked height equals the dispatched one, so neither
    // sync path can act on a height difference.
    runCatching { callback.syncKeyboardPosition(881.0, true) }
    stageRootInsets(heightPx = 881)
    callback.onPrepare(imeAnimation())
    SystemClock.sleep(2_500)
    reactContext.events.clear()

    runCatching { callback.onApplyWindowInsets(root, visibleImeInsets(heightPx = 881)) }

    assertFalse("an orphaned transition must clear even when no height changed", field("isTransitioning") as Boolean)
    assertEquals(
      "the catch-up must still round out the lifecycle the stuck animation owes",
      listOf("KeyboardController::keyboardDidShow"),
      reactContext.events.map { it.first },
    )
  }

  @Test
  fun `a cancelled open back to zero still recovers to hidden`() {
    // Consume the setup traversal before it can restage the root (see the grace-window
    // test): the staged insets below must survive until the dispatch.
    shadowOf(Looper.getMainLooper()).idleFor(Duration.ofMillis(50))

    // The window briefly reported the keyboard visible when the open animation started:
    // `onStart` memorized it as visible, persisted 881, and already emitted `willShow`.
    // The user then cancelled, the window returned to 0, and the lifecycle lost its
    // `onEnd` - every tracked height already reads 0, so only the memorized visibility
    // is left stranded.
    stageRootInsets(heightPx = 881)
    callback.onPrepare(imeAnimation())
    runCatching {
      callback.onStart(imeAnimation(), WindowInsetsAnimationCompat.BoundsCompat(Insets.NONE, Insets.NONE))
    }
    assertEquals(
      "the open start must have announced the briefly visible keyboard",
      listOf<Pair<String, Double?>>("KeyboardController::keyboardWillShow" to 881.0),
      reactContext.events,
    )

    stageHiddenRootInsets()
    SystemClock.sleep(2_600)
    reactContext.events.clear()
    runCatching { callback.onApplyWindowInsets(root, hiddenImeInsets()) }

    assertFalse("a cancelled open must not stay latched", field("isTransitioning") as Boolean)
    assertEquals("the tracked height must read the hidden window", 0.0, field("prevKeyboardHeight"))
    assertEquals("the persisted height must read the hidden window", 0.0, field("persistentKeyboardHeight"))
    assertEquals(
      "JS only hears `didHide` on close - the recovery must emit it, or it stays stuck visible",
      listOf<Pair<String, Double?>>("KeyboardController::keyboardDidHide" to 0.0),
      reactContext.events,
    )
  }

  @Test
  fun `a deferred recheck trusts the live window over the captured insets`() {
    // Consume the setup traversal before it can restage the root (see the grace-window
    // test): the window the recheck reads must stay the one staged below.
    shadowOf(Looper.getMainLooper()).idleFor(Duration.ofMillis(50))

    // Shown at 400, a grow transition to 881 settles inside the grace window and the
    // recheck is scheduled from those insets.
    runCatching { callback.syncKeyboardPosition(400.0, true) }
    stageRootInsets(heightPx = 400)
    callback.onPrepare(imeAnimation())
    runCatching { callback.onApplyWindowInsets(root, visibleImeInsets(heightPx = 881)) }
    reactContext.events.clear()

    // The keyboard then hides and that notification is lost too - exactly the loss the
    // recovery exists for. The recheck must not resurrect the captured 881.
    stageHiddenRootInsets()
    shadowOf(Looper.getMainLooper()).idleFor(Duration.ofMillis(2_300))

    assertEquals(
      "the recheck must recover to the live hidden window, not the insets captured at dispatch time",
      listOf<Pair<String, Double?>>("KeyboardController::keyboardDidHide" to 0.0),
      reactContext.events,
    )
  }

  @Test
  fun `a suspended callback stays quiet through a stale resize`() {
    // A Modal owns the screen: its own window's callback reports the keyboard while the
    // main one is suspended.
    runCatching { callback.syncKeyboardPosition(881.0, true) }
    stageRootInsets(heightPx = 881)
    callback.onPrepare(imeAnimation())
    SystemClock.sleep(2_500)
    callback.suspend(true)
    reactContext.events.clear()

    // A stale transition plus a height change must not emit through the suspended
    // callback; the latch waits for the insets re-dispatch that follows un-pause.
    stageRootInsets(heightPx = 1080)
    runCatching { callback.onApplyWindowInsets(root, visibleImeInsets(heightPx = 1080)) }

    assertEquals(
      "a suspended callback must not emit keyboard events",
      emptyList<Pair<String, Double?>>(),
      reactContext.events,
    )
    assertTrue("the latch must wait for the un-pause", field("isTransitioning") as Boolean)
  }

  private fun imeAnimation(): WindowInsetsAnimationCompat =
    WindowInsetsAnimationCompat(WindowInsetsCompat.Type.ime(), null, 300)

  /**
   * Robolectric's `dispatchApplyWindowInsets` does not populate what `getRootWindowInsets`
   * returns (the callback's height and visibility reads), so the insets a real dispatch
   * would leave on the root are placed there directly.
   */
  private fun stageRootInsets(heightPx: Int) {
    stageRootInsets(visibleImeInsets(heightPx))
  }

  /** The window a dismissed keyboard leaves behind: no ime insets and none visible. */
  private fun stageHiddenRootInsets() {
    stageRootInsets(hiddenImeInsets())
  }

  private fun stageRootInsets(insets: WindowInsetsCompat) {
    val impl = View::class.java.getMethod("getViewRootImpl").invoke(root)
    val field = impl.javaClass.getDeclaredField("mLastWindowInsets")
    field.isAccessible = true
    field.set(impl, insets.toWindowInsets()!!)
  }

  private fun visibleImeInsets(heightPx: Int): WindowInsetsCompat =
    WindowInsetsCompat
      .Builder()
      .setInsets(WindowInsetsCompat.Type.ime(), Insets.of(0, 0, 0, heightPx))
      .setVisible(WindowInsetsCompat.Type.ime(), true)
      .setInsets(WindowInsetsCompat.Type.navigationBars(), Insets.NONE)
      .build()

  private fun hiddenImeInsets(): WindowInsetsCompat =
    WindowInsetsCompat
      .Builder()
      .setInsets(WindowInsetsCompat.Type.ime(), Insets.NONE)
      .setVisible(WindowInsetsCompat.Type.ime(), false)
      .setInsets(WindowInsetsCompat.Type.navigationBars(), Insets.NONE)
      .build()

  private fun applyImeInsets(heightPx: Int) {
    val insets =
      WindowInsetsCompat
        .Builder()
        .setInsets(WindowInsetsCompat.Type.ime(), Insets.of(0, 0, 0, heightPx))
        .setInsets(WindowInsetsCompat.Type.navigationBars(), Insets.NONE)
        .build()
    runCatching { callback.onApplyWindowInsets(root, insets) }
  }

  private fun dispatchFocus(
    oldFocus: View,
    newFocus: View,
  ) {
    // The framework's focus dispatch is hidden from unit tests, so the registered
    // listener is invoked the way the framework would have.
    val listener =
      KeyboardAnimationCallback::class.java
        .getDeclaredField("focusListener")
        .apply { isAccessible = true }
        .get(callback) as ViewTreeObserver.OnGlobalFocusChangeListener
    runCatching { listener.onGlobalFocusChanged(oldFocus, newFocus) }
  }

  @Suppress("SameParameterValue")
  private fun field(name: String): Any? {
    val declared = KeyboardAnimationCallback::class.java.getDeclaredField(name)
    declared.isAccessible = true
    return declared.get(callback)
  }
}

/** RN's `Arguments` build JNI-backed collections; the pure-Java ones work in JVM tests. */
@Implements(Arguments::class)
class ShadowArguments {
  companion object {
    @JvmStatic
    @Implementation
    fun createMap(): WritableMap = JavaOnlyMap()

    @JvmStatic
    @Implementation
    fun createArray(): WritableArray = JavaOnlyArray()
  }
}

/** Records what a live runtime would have received through `RCTDeviceEventEmitter`. */
private class RecordingReactContext(
  context: Context,
) : BridgeReactContext(context) {
  val events = mutableListOf<Pair<String, Double?>>()

  override fun <T : JavaScriptModule> getJSModule(moduleInterface: Class<T>): T {
    val proxy =
      Proxy.newProxyInstance(
        moduleInterface.classLoader,
        arrayOf(moduleInterface),
      ) { _, method, args ->
        if (method.name == "emit" && args != null && args.size == 2) {
          val params = args[1] as? WritableMap
          events.add(args[0] as String to params?.takeIf { it.hasKey("height") }?.getDouble("height"))
        }
        null
      }
    @Suppress("UNCHECKED_CAST")
    return proxy as T
  }
}
