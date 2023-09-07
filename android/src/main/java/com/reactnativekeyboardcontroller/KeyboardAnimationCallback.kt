package com.reactnativekeyboardcontroller

import android.animation.ValueAnimator
import android.os.Build
import android.util.Log
import android.view.View
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
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.textinput.ReactEditText
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.events.KeyboardTransitionEvent
import com.reactnativekeyboardcontroller.extensions.dp
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
  private var persistentKeyboardHeight = 0.0
  private var isKeyboardVisible = false
  private var isTransitioning = false
  private var duration = 0
  private var viewTagFocused = -1

  init {
    require(persistentInsetTypes and deferredInsetTypes == 0) {
      "persistentInsetTypes and deferredInsetTypes can not contain any of " +
        " same WindowInsetsCompat.Type values"
    }

    view.viewTreeObserver.addOnGlobalFocusChangeListener { oldFocus, newFocus ->
      if (newFocus is ReactEditText) {
        viewTagFocused = newFocus.id

        // keyboard is visible and focus has been changed
        if (this.isKeyboardVisible && oldFocus !== null) {
          // imitate iOS behavior and send two instant start/end events containing an info about new tag
          // 1. onStart/onMove/onEnd can be still dispatched after, if keyboard change size (numeric -> alphabetic type)
          // 2. event should be send only when keyboard is visible, since this event arrives earlier -> `tag` will be
          // 100% included in onStart/onMove/onEnd lifecycles, but triggering onStart/onEnd several time
          // can bring breaking changes
          this.sendEventToJS(
            KeyboardTransitionEvent(
              surfaceId,
              view.id,
              "topKeyboardMoveStart",
              this.persistentKeyboardHeight,
              1.0,
              0,
              viewTagFocused,
            ),
          )
          this.sendEventToJS(
            KeyboardTransitionEvent(
              surfaceId,
              view.id,
              "topKeyboardMoveEnd",
              this.persistentKeyboardHeight,
              1.0,
              0,
              viewTagFocused,
            ),
          )
          this.emitEvent("KeyboardController::keyboardWillShow", getEventParams(this.persistentKeyboardHeight))
          this.emitEvent("KeyboardController::keyboardDidShow", getEventParams(this.persistentKeyboardHeight))
        }
      }
    }
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
   * In the method below we fully recreate the logic that is implemented on old android versions:
   * - we dispatch `keyboardWillShow` (onStart);
   * - we dispatch change height/progress as animated values (onProgress);
   * - we dispatch `keyboardDidShow` (onEnd).
   */
  override fun onApplyWindowInsets(v: View, insets: WindowInsetsCompat): WindowInsetsCompat {
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
    if (isKeyboardShown && !isMoving && Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      val keyboardHeight = getCurrentKeyboardHeight()
      val duration = DEFAULT_ANIMATION_TIME.toInt()

      this.emitEvent("KeyboardController::keyboardWillShow", getEventParams(keyboardHeight))
      this.sendEventToJS(
        KeyboardTransitionEvent(
          surfaceId,
          view.id,
          "topKeyboardMoveStart",
          keyboardHeight,
          1.0,
          duration,
          viewTagFocused,
        ),
      )

      val animation = ValueAnimator.ofFloat(this.persistentKeyboardHeight.toFloat(), keyboardHeight.toFloat())
      animation.addUpdateListener { animator ->
        val toValue = animator.animatedValue as Float
        this.sendEventToJS(
          KeyboardTransitionEvent(
            surfaceId,
            view.id,
            "topKeyboardMove",
            toValue.toDouble(),
            toValue.toDouble() / keyboardHeight,
            duration,
            viewTagFocused,
          ),
        )
      }
      animation.doOnEnd {
        this.emitEvent("KeyboardController::keyboardDidShow", getEventParams(keyboardHeight))
        this.sendEventToJS(
          KeyboardTransitionEvent(
            surfaceId,
            view.id,
            "topKeyboardMoveEnd",
            keyboardHeight,
            1.0,
            duration,
            viewTagFocused,
          ),
        )
      }
      animation.setDuration(DEFAULT_ANIMATION_TIME).startDelay = 0
      animation.start()

      this.persistentKeyboardHeight = keyboardHeight
    }

    return insets
  }

  override fun onStart(
    animation: WindowInsetsAnimationCompat,
    bounds: WindowInsetsAnimationCompat.BoundsCompat,
  ): WindowInsetsAnimationCompat.BoundsCompat {
    isTransitioning = true
    isKeyboardVisible = isKeyboardVisible()
    duration = animation.durationMillis.toInt()
    val keyboardHeight = getCurrentKeyboardHeight()

    if (isKeyboardVisible) {
      // do not update it on hide, since back progress will be invalid
      this.persistentKeyboardHeight = keyboardHeight
    }

    this.emitEvent(
      "KeyboardController::" + if (!isKeyboardVisible) "keyboardWillHide" else "keyboardWillShow",
      getEventParams(keyboardHeight),
    )

    Log.i(TAG, "HEIGHT:: $keyboardHeight TAG:: $viewTagFocused")
    this.sendEventToJS(
      KeyboardTransitionEvent(
        surfaceId,
        view.id,
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
    Log.i(TAG, "DiffY: $diffY $height $progress ${InteractiveKeyboardProvider.isInteractive} $viewTagFocused")

    val event = if (InteractiveKeyboardProvider.isInteractive) "topKeyboardMoveInteractive" else "topKeyboardMove"
    this.sendEventToJS(KeyboardTransitionEvent(surfaceId, view.id, event, height, progress, duration, viewTagFocused))

    return insets
  }

  override fun onEnd(animation: WindowInsetsAnimationCompat) {
    super.onEnd(animation)

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

    this.emitEvent(
      "KeyboardController::" + if (!isKeyboardVisible) "keyboardDidHide" else "keyboardDidShow",
      getEventParams(keyboardHeight),
    )
    this.sendEventToJS(
      KeyboardTransitionEvent(
        surfaceId,
        view.id,
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

  private fun sendEventToJS(event: Event<*>) {
    val eventDispatcher: EventDispatcher? =
      UIManagerHelper.getEventDispatcherForReactTag(context, view.id)
    eventDispatcher?.dispatchEvent(event)
  }

  private fun emitEvent(event: String, params: WritableMap) {
    context?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)?.emit(event, params)

    Log.i(TAG, event)
  }

  private fun getEventParams(height: Double): WritableMap {
    val params: WritableMap = Arguments.createMap()
    params.putDouble("height", height)
    params.putInt("duration", duration)
    params.putDouble("timestamp", System.currentTimeMillis().toDouble())
    params.putInt("target", viewTagFocused)

    return params
  }

  companion object {
    private const val DEFAULT_ANIMATION_TIME = 250L
  }
}
