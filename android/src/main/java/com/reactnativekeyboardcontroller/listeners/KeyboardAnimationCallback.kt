package com.reactnativekeyboardcontroller.listeners

import android.animation.ValueAnimator
import android.os.Build
import android.util.Log
import android.view.View
import android.view.ViewTreeObserver.OnGlobalFocusChangeListener
import androidx.core.animation.doOnEnd
import androidx.core.graphics.Insets
import androidx.core.view.OnApplyWindowInsetsListener
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.textinput.ReactEditText
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.InteractiveKeyboardProvider
import com.reactnativekeyboardcontroller.events.KeyboardTransitionEvent
import com.reactnativekeyboardcontroller.events.KeyboardTransitionEventData
import com.reactnativekeyboardcontroller.extensions.dispatchEvent
import com.reactnativekeyboardcontroller.extensions.dp
import com.reactnativekeyboardcontroller.extensions.emitEvent
import com.reactnativekeyboardcontroller.extensions.isKeyboardAnimation
import kotlin.math.abs

private val TAG = KeyboardAnimationCallback::class.qualifiedName

class KeyboardAnimationCallback(
  val view: ReactViewGroup,
  val persistentInsetTypes: Int,
  val deferredInsetTypes: Int,
  dispatchMode: Int = DISPATCH_MODE_STOP,
  val context: ThemedReactContext?,
) : WindowInsetsAnimationCompat.Callback(dispatchMode), OnApplyWindowInsetsListener {
  private val surfaceId = UIManagerHelper.getSurfaceId(view)

  // state variables
  private var persistentKeyboardHeight = 0.0
  private var isKeyboardVisible = false
  private var isTransitioning = false
  private var duration = 0
  private var viewTagFocused = -1
  private var animation: ValueAnimator? = null
  private var lastEventDispatched: KeyboardTransitionEventData? = null

  // listeners
  private val focusListener = OnGlobalFocusChangeListener { oldFocus, newFocus ->
    if (newFocus is ReactEditText) {
      viewTagFocused = newFocus.id

      // keyboard is visible and focus has been changed
      if (this.isKeyboardVisible && oldFocus !== null) {
        // imitate iOS behavior and send two instant start/end events containing an info about new tag
        // 1. onStart/onMove/onEnd can be still dispatched after, if keyboard change size (numeric -> alphabetic type)
        // 2. event should be send only when keyboard is visible, since this event arrives earlier -> `tag` will be
        // 100% included in onStart/onMove/onEnd lifecycles, but triggering onStart/onEnd several time
        // can bring breaking changes
        this.dispatchEventToJS(
          KeyboardTransitionEventData(
            "topKeyboardMoveStart",
            this.persistentKeyboardHeight,
            1.0,
            0,
            viewTagFocused,
          ),
        )
        this.dispatchEventToJS(
          KeyboardTransitionEventData(
            "topKeyboardMoveEnd",
            this.persistentKeyboardHeight,
            1.0,
            0,
            viewTagFocused,
          ),
        )
        context.emitEvent("KeyboardController::keyboardWillShow", getEventParams(this.persistentKeyboardHeight))
        context.emitEvent("KeyboardController::keyboardDidShow", getEventParams(this.persistentKeyboardHeight))
      }
    }
  }
  private var layoutObserver: FocusedInputObserver? = null

  init {
    require(persistentInsetTypes and deferredInsetTypes == 0) {
      "persistentInsetTypes and deferredInsetTypes can not contain any of " +
        " same WindowInsetsCompat.Type values"
    }

    layoutObserver = FocusedInputObserver(view = view, context = context)
    view.viewTreeObserver.addOnGlobalFocusChangeListener(focusListener)
  }

  /**
   * When keyboard changes its size we have different behavior per APIs.
   * On 21<=API<30 - WindowInsetsAnimationCompat dispatches onStart/onProgress/onEnd events.
   * On API>=30 - WindowInsetsAnimationCompat doesn't dispatch anything. As a result behavior
   * between different Android versions is not consistent. On old Android versions we have a
   * reaction, on newer versions - not. In my understanding it's a bug in core library and the
   * behavior should be consistent across all versions of platform. To level the difference we
   * have to implement `onApplyWindowInsets` listener and simulate onStart/onProgress/onEnd
   * events when keyboard changes its size.
   */
  override fun onApplyWindowInsets(v: View, insets: WindowInsetsCompat): WindowInsetsCompat {
    val keyboardHeight = getCurrentKeyboardHeight()
    // when keyboard appears values will be (false && true)
    // when keyboard disappears values will be (true && false)
    val isKeyboardShown = isKeyboardVisible && isKeyboardVisible()
    // `isTransitioning` check is needed to avoid calls of `onApplyWindowInsets` during keyboard animation
    // having such check allows us not to dispatch unnecessary incorrect events
    // the condition will be executed only when keyboard is opened and changes its size
    // (for example it happens when user changes keyboard type from 'text' to 'emoji' input
    //
    // `InteractiveKeyboardProvider.isInteractive` detect case when keyboard moves
    // because of the gesture
    val isMoving = isTransitioning || InteractiveKeyboardProvider.isInteractive
    val isKeyboardFullyVisible = isKeyboardShown && !isMoving
    // when keyboard is opened and we trigger a transition from screen A to screen B,
    // then this method is getting called and we start dispatching events, and later original
    // `onStart`/`onProgress`/`onEnd` emitting their events (since keyboard is closing) and we
    // are getting race conditions.
    //
    // but in general this check is a must because we are detecting keyboard size changes
    // in this method
    val isKeyboardSizeEqual = this.persistentKeyboardHeight == keyboardHeight

    if (isKeyboardFullyVisible && !isKeyboardSizeEqual && Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      Log.i(TAG, "onApplyWindowInsets: ${this.persistentKeyboardHeight} -> $keyboardHeight")
      layoutObserver?.syncUpLayout()
      this.onKeyboardResized(keyboardHeight)
    }

    return insets
  }

  override fun onStart(
    animation: WindowInsetsAnimationCompat,
    bounds: WindowInsetsAnimationCompat.BoundsCompat,
  ): WindowInsetsAnimationCompat.BoundsCompat {
    if (!animation.isKeyboardAnimation) {
      return bounds
    }

    isTransitioning = true
    isKeyboardVisible = isKeyboardVisible()
    duration = animation.durationMillis.toInt()
    val keyboardHeight = getCurrentKeyboardHeight()

    if (isKeyboardVisible) {
      // do not update it on hide, since back progress will be invalid
      this.persistentKeyboardHeight = keyboardHeight
    }

    layoutObserver?.syncUpLayout()
    context.emitEvent(
      "KeyboardController::" + if (!isKeyboardVisible) "keyboardWillHide" else "keyboardWillShow",
      getEventParams(keyboardHeight),
    )

    Log.i(TAG, "HEIGHT:: $keyboardHeight TAG:: $viewTagFocused")
    this.dispatchEventToJS(
      KeyboardTransitionEventData(
        "topKeyboardMoveStart",
        keyboardHeight,
        if (!isKeyboardVisible) 0.0 else 1.0,
        duration,
        viewTagFocused,
      ),
    )

    return super.onStart(animation, bounds)
  }

  override fun onProgress(
    insets: WindowInsetsCompat,
    runningAnimations: List<WindowInsetsAnimationCompat>,
  ): WindowInsetsCompat {
    // onProgress() is called when any of the running animations progress...

    // ignore non-keyboard animation
    runningAnimations.find { it.isKeyboardAnimation } ?: return insets

    // First we get the insets which are potentially deferred
    val typesInset = insets.getInsets(deferredInsetTypes)
    // Then we get the persistent inset types which are applied as padding during layout
    val otherInset = insets.getInsets(persistentInsetTypes)

    // Now that we subtract the two insets, to calculate the difference. We also coerce
    // the insets to be >= 0, to make sure we don't use negative insets.
    val diff = Insets.subtract(typesInset, otherInset).let {
      Insets.max(it, Insets.NONE)
    }
    val diffY = (diff.bottom - diff.top).toFloat()
    val height = diffY.dp

    var progress = 0.0
    try {
      progress = abs((height / persistentKeyboardHeight)).let { if (it.isNaN()) 0.0 else it }
    } catch (e: ArithmeticException) {
      // do nothing, just log an exception send progress as 0
      Log.w(TAG, "Caught arithmetic exception during `progress` calculation: $e")
    }
    Log.i(
      TAG,
      "DiffY: $diffY $height $progress ${InteractiveKeyboardProvider.isInteractive} $viewTagFocused",
    )

    val event = if (InteractiveKeyboardProvider.isInteractive) "topKeyboardMoveInteractive" else "topKeyboardMove"
    this.dispatchEventToJS(
      KeyboardTransitionEventData(
        event,
        height,
        progress,
        duration,
        viewTagFocused,
      ),
    )

    return insets
  }

  override fun onEnd(animation: WindowInsetsAnimationCompat) {
    super.onEnd(animation)

    if (!animation.isKeyboardAnimation) {
      return
    }

    isTransitioning = false
    duration = animation.durationMillis.toInt()

    var keyboardHeight = this.persistentKeyboardHeight
    // if keyboard becomes shown after interactive animation completion
    // getCurrentKeyboardHeight() will be `0` and isKeyboardVisible will be `false`
    // it's not correct behavior, so we are handling it here
    val isKeyboardShown = InteractiveKeyboardProvider.shown
    if (!isKeyboardShown) {
      keyboardHeight = getCurrentKeyboardHeight()
    } else {
      // if keyboard is shown after interactions and the animation has finished
      // then we need to reset the state
      InteractiveKeyboardProvider.shown = false
    }
    isKeyboardVisible = isKeyboardVisible || isKeyboardShown

    context.emitEvent(
      "KeyboardController::" + if (!isKeyboardVisible) "keyboardDidHide" else "keyboardDidShow",
      getEventParams(keyboardHeight),
    )
    this.dispatchEventToJS(
      KeyboardTransitionEventData(
        "topKeyboardMoveEnd",
        keyboardHeight,
        if (!isKeyboardVisible) 0.0 else 1.0,
        duration,
        viewTagFocused,
      ),
    )

    // reset to initial state
    duration = 0
  }

  fun destroy() {
    view.viewTreeObserver.removeOnGlobalFocusChangeListener(focusListener)
    layoutObserver?.destroy()
  }

  /*
   * In the method below we recreate the logic that used when keyboard appear/disappear:
   * - we dispatch `keyboardWillShow` (onStart);
   * - we dispatch change height/progress as animated values (onProgress);
   * - we dispatch `keyboardDidShow` (onEnd).
   */
  private fun onKeyboardResized(keyboardHeight: Double) {
    if (this.animation?.isRunning == true) {
      Log.i(TAG, "onKeyboardResized -> cancelling animation that is in progress")
      // if animation is in progress, then we are:
      // - removing listeners (update, onEnd)
      // - updating `persistentKeyboardHeight` to latest animated value
      // - cancelling animation to free up CPU resources
      this.animation?.removeAllListeners()
      this.persistentKeyboardHeight = (this.animation?.animatedValue as Float).toDouble()
      this.animation?.cancel()
    }

    context.emitEvent("KeyboardController::keyboardWillShow", getEventParams(keyboardHeight))
    this.dispatchEventToJS(
      KeyboardTransitionEventData(
        "topKeyboardMoveStart",
        keyboardHeight,
        1.0,
        DEFAULT_ANIMATION_TIME,
        viewTagFocused,
      ),
    )

    val animation =
      ValueAnimator.ofFloat(this.persistentKeyboardHeight.toFloat(), keyboardHeight.toFloat())
    animation.addUpdateListener { animator ->
      val toValue = animator.animatedValue as Float
      this.dispatchEventToJS(
        KeyboardTransitionEventData(
          "topKeyboardMove",
          toValue.toDouble(),
          toValue.toDouble() / keyboardHeight,
          DEFAULT_ANIMATION_TIME,
          viewTagFocused,
        ),
      )
    }
    animation.doOnEnd {
      context.emitEvent("KeyboardController::keyboardDidShow", getEventParams(keyboardHeight))
      this.dispatchEventToJS(
        KeyboardTransitionEventData(
          "topKeyboardMoveEnd",
          keyboardHeight,
          1.0,
          DEFAULT_ANIMATION_TIME,
          viewTagFocused,
        ),
      )
      this.animation = null
    }
    animation.setDuration(DEFAULT_ANIMATION_TIME.toLong()).startDelay = 0
    animation.start()

    this.animation = animation
    this.persistentKeyboardHeight = keyboardHeight
  }

  private fun isKeyboardVisible(): Boolean {
    val insets = ViewCompat.getRootWindowInsets(view)

    return insets?.isVisible(WindowInsetsCompat.Type.ime()) ?: false
  }

  private fun getCurrentKeyboardHeight(): Double {
    val insets = ViewCompat.getRootWindowInsets(view)
    val keyboardHeight = insets?.getInsets(WindowInsetsCompat.Type.ime())?.bottom ?: 0
    val navigationBar = insets?.getInsets(WindowInsetsCompat.Type.navigationBars())?.bottom ?: 0

    // on hide it will be negative value, so we are using max function
    return (keyboardHeight - navigationBar).toFloat().dp.coerceAtLeast(0.0)
  }

  private fun getEventParams(height: Double): WritableMap {
    val params: WritableMap = Arguments.createMap()
    params.putDouble("height", height)
    params.putInt("duration", duration)
    params.putDouble("timestamp", System.currentTimeMillis().toDouble())
    params.putInt("target", viewTagFocused)

    return params
  }

  private fun dispatchEventToJS(event: KeyboardTransitionEventData) {
    if (event != lastEventDispatched) {
      lastEventDispatched = event
      context.dispatchEvent(
        view.id,
        KeyboardTransitionEvent(
          surfaceId,
          view.id,
          data = event,
        ),
      )
    }
  }

  companion object {
    private const val DEFAULT_ANIMATION_TIME = 250
  }
}
