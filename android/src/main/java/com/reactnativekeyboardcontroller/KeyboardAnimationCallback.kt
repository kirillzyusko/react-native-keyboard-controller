package com.reactnativekeyboardcontroller

import android.animation.ValueAnimator
import android.content.Context
import android.util.Log
import android.view.View
import androidx.core.graphics.Insets
import androidx.core.view.OnApplyWindowInsetsListener
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.events.Event
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.events.KeyboardTransitionEvent

fun toDp(px: Float, context: Context?): Int {
  if (context == null) {
    return 0
  }

  return (px / context.resources.displayMetrics.density).toInt()
}

class TranslateDeferringInsetsAnimationCallback(
  val view: ReactViewGroup,
  val persistentInsetTypes: Int,
  val deferredInsetTypes: Int,
  dispatchMode: Int = DISPATCH_MODE_STOP,
  val context: ReactApplicationContext?
) : WindowInsetsAnimationCompat.Callback(dispatchMode), OnApplyWindowInsetsListener {
  private val TAG = TranslateDeferringInsetsAnimationCallback::class.qualifiedName
  private var persistentKeyboardHeight = 0
  private var isKeyboardVisible = this.isKeyboardVisible()

  init {
    require(persistentInsetTypes and deferredInsetTypes == 0) {
      "persistentInsetTypes and deferredInsetTypes can not contain any of " +
        " same WindowInsetsCompat.Type values"
    }
  }

  // TODO: (x) it dispatches too frequently
  // TODO: (x) move code duplication to separated method
  // TODO: dispatch didShow event
  // TODO: calculate animated progress (should it be >1?)
  // TODO: (x) remove android documentation
  // TODO: (x) rename class?
  override fun onApplyWindowInsets(v: View?, insets: WindowInsetsCompat?): WindowInsetsCompat {
    // sometimes this method is called after `onStart` (keyboard appears),
    // sometimes it's called before `onStart` (keyboard hides)
    // since `onStart` updates `isKeyboardVisible` in order to avoid
    // unnecessary calls we will need to use the double check
    // TODO: write why it's needed
    if (isKeyboardVisible && isKeyboardVisible()) {
      val keyboardHeight = getCurrentKeyboardHeight()
      /*val animation = ValueAnimator.ofInt(-this.persistentKeyboardHeight, -keyboardHeight)
      animation.addUpdateListener { animator ->
        val toValue = animator.animatedValue as Int
        this.sendEventToJS(KeyboardTransitionEvent(view.id, toValue, 1.0))
      }

      animation.setDuration(250).startDelay = 0
      animation.start()*/

      this.sendEventToJS(KeyboardTransitionEvent(view.id, -keyboardHeight, 1.0))

      this.persistentKeyboardHeight = keyboardHeight
    }

    return WindowInsetsCompat.CONSUMED
  }

  override fun onStart(
    animation: WindowInsetsAnimationCompat,
    bounds: WindowInsetsAnimationCompat.BoundsCompat
  ): WindowInsetsAnimationCompat.BoundsCompat {
    isKeyboardVisible = isKeyboardVisible()
    val keyboardHeight = getCurrentKeyboardHeight()

    if (isKeyboardVisible) {
      // do not update it on hide, since back progress will be invalid
      this.persistentKeyboardHeight = keyboardHeight
    }

    val params: WritableMap = Arguments.createMap()
    params.putInt("height", keyboardHeight)
    context?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)?.emit("KeyboardController::" + if (!isKeyboardVisible) "keyboardWillHide" else "keyboardWillShow", params)

    Log.i(TAG, "KeyboardController::" + if (!isKeyboardVisible) "keyboardWillHide" else "keyboardWillShow")
    Log.i(TAG, "HEIGHT:: $keyboardHeight")

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
    val diffY = (diff.top - diff.bottom).toFloat()
    val height = toDp(diffY, context)

    var progress = 0.0
    try {
      progress = Math.abs((height.toDouble() / persistentKeyboardHeight))
    } catch (e: ArithmeticException) {
      // do nothing, send progress as 0
    }
    Log.i(TAG, "DiffY: $diffY $height")

    this.sendEventToJS(KeyboardTransitionEvent(view.id, height, progress))

    return insets
  }

  override fun onEnd(animation: WindowInsetsAnimationCompat) {
    super.onEnd(animation)

    val params: WritableMap = Arguments.createMap()
    context?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)?.emit("KeyboardController::" + if (!isKeyboardVisible) "keyboardDidHide" else "keyboardDidShow", params)

    Log.i(TAG, "KeyboardController::" + if (!isKeyboardVisible) "keyboardDidHide" else "keyboardDidShow")
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
    context
      ?.getNativeModule(UIManagerModule::class.java)
      ?.eventDispatcher
      ?.dispatchEvent(event)
  }
}
