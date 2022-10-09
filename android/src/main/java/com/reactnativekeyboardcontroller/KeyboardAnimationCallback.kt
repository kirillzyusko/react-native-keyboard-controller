package com.reactnativekeyboardcontroller

import android.animation.ValueAnimator
import android.content.Context
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
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.events.KeyboardTransitionEvent

fun toDp(px: Float, context: Context?): Int {
  if (context == null) {
    return 0
  }

  return (px / context.resources.displayMetrics.density).toInt()
}

class KeyboardAnimationCallback(
  val view: ReactViewGroup,
  val persistentInsetTypes: Int,
  val deferredInsetTypes: Int,
  dispatchMode: Int = DISPATCH_MODE_STOP,
  val context: ReactApplicationContext?,
  val onApplyWindowInsetsListener: OnApplyWindowInsetsListener
) : WindowInsetsAnimationCompat.Callback(dispatchMode), OnApplyWindowInsetsListener {
  private val TAG = KeyboardAnimationCallback::class.qualifiedName
  private var persistentKeyboardHeight = 0
  private var isKeyboardVisible = false
  private var isTransitioning = false

  init {
    require(persistentInsetTypes and deferredInsetTypes == 0) {
      "persistentInsetTypes and deferredInsetTypes can not contain any of " +
        " same WindowInsetsCompat.Type values"
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
    // `!isTransitioning` check is needed to avoid calls of `onApplyWindowInsets` during keyboard animation
    // having such check allows us not to dispatch unnecessary incorrect events
    // the condition will be executed only when keyboard is opened and changes its size
    // (for example it happens when user changes keyboard type from 'text' to 'emoji' input
    if (isKeyboardVisible && isKeyboardVisible() && !isTransitioning && Build.VERSION.SDK_INT >= 30) {
      val keyboardHeight = getCurrentKeyboardHeight()

      this.emitEvent("KeyboardController::keyboardWillShow", getEventParams(keyboardHeight))
      this.sendEventToJS(KeyboardTransitionEvent(view.id, "topKeyboardMoveStart", keyboardHeight, 1.0))

      val animation = ValueAnimator.ofInt(this.persistentKeyboardHeight, keyboardHeight)
      animation.addUpdateListener { animator ->
        val toValue = animator.animatedValue as Int
        this.sendEventToJS(KeyboardTransitionEvent(view.id, "topKeyboardMove", toValue, toValue.toDouble() / keyboardHeight))
      }
      animation.doOnEnd {
        this.emitEvent("KeyboardController::keyboardDidShow", getEventParams(keyboardHeight))
        this.sendEventToJS(KeyboardTransitionEvent(view.id, "topKeyboardMoveEnd", keyboardHeight, 1.0))
      }
      animation.setDuration(250).startDelay = 0
      animation.start()

      this.persistentKeyboardHeight = keyboardHeight
    }

    return onApplyWindowInsetsListener.onApplyWindowInsets(v, insets)
  }

  override fun onStart(
    animation: WindowInsetsAnimationCompat,
    bounds: WindowInsetsAnimationCompat.BoundsCompat
  ): WindowInsetsAnimationCompat.BoundsCompat {
    isTransitioning = true
    isKeyboardVisible = isKeyboardVisible()
    val keyboardHeight = getCurrentKeyboardHeight()

    if (isKeyboardVisible) {
      // do not update it on hide, since back progress will be invalid
      this.persistentKeyboardHeight = keyboardHeight
    }

    this.emitEvent("KeyboardController::" + if (!isKeyboardVisible) "keyboardWillHide" else "keyboardWillShow", getEventParams(keyboardHeight))

    Log.i(TAG, "HEIGHT:: $keyboardHeight")
    this.sendEventToJS(KeyboardTransitionEvent(view.id, "topKeyboardMoveStart", keyboardHeight, if (!isKeyboardVisible) 0.0 else 1.0))

    return super.onStart(animation, bounds)
  }

  override fun onProgress(
    insets: WindowInsetsCompat,
    runningAnimations: List<WindowInsetsAnimationCompat>
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
    val height = toDp(diffY, context)

    var progress = 0.0
    try {
      progress = Math.abs((height.toDouble() / persistentKeyboardHeight)).let { if (it.isNaN()) 0.0 else it }
    } catch (e: ArithmeticException) {
      // do nothing, send progress as 0
    }
    Log.i(TAG, "DiffY: $diffY $height $progress")

    this.sendEventToJS(KeyboardTransitionEvent(view.id, "topKeyboardMove", height, progress))

    return insets
  }

  override fun onEnd(animation: WindowInsetsAnimationCompat) {
    super.onEnd(animation)

    isTransitioning = false
    this.persistentKeyboardHeight = getCurrentKeyboardHeight()
    this.emitEvent("KeyboardController::" + if (!isKeyboardVisible) "keyboardDidHide" else "keyboardDidShow", getEventParams(this.persistentKeyboardHeight))
    this.sendEventToJS(KeyboardTransitionEvent(view.id, "topKeyboardMoveEnd", this.persistentKeyboardHeight, if (!isKeyboardVisible) 0.0 else 1.0))
  }

  private fun isKeyboardVisible(): Boolean {
    val insets = ViewCompat.getRootWindowInsets(view)

    return insets?.isVisible(WindowInsetsCompat.Type.ime()) ?: false
  }

  private fun getCurrentKeyboardHeight(): Int {
    val insets = ViewCompat.getRootWindowInsets(view)
    val keyboardHeight = insets?.getInsets(WindowInsetsCompat.Type.ime())?.bottom ?: 0
    val navigationBar = insets?.getInsets(WindowInsetsCompat.Type.navigationBars())?.bottom ?: 0

    // on hide it will be negative value, so we are using max function
    return Math.max(toDp((keyboardHeight - navigationBar).toFloat(), context), 0)
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

  private fun getEventParams(height: Int): WritableMap {
    val params: WritableMap = Arguments.createMap()
    params.putInt("height", height)

    return params
  }
}
