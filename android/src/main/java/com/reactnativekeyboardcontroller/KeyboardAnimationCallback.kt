package com.reactnativekeyboardcontroller

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

  override fun onApplyWindowInsets(v: View?, insets: WindowInsetsCompat): WindowInsetsCompat {
    // this method calls everytime when keyboard appears or hides
    // and it calls before `onStart` (in `onStart` we update `this.isKeyboardVisible` field)
    // so when keyboard appears values will be (false && true)
    // when keyboard disappears values will be (true && false)
    //
    // having such check allows us not to dispatch unnecessary incorrect events
    if (isKeyboardVisible && isKeyboardVisible()) {
      val keyboardHeight = getCurrentKeyboardHeight()
      /**
       * By default it's up to OS whether to animate keyboard changes or not.
       * For example my Xiaomi Redmi Note 5 Pro (Android 9) applies layout animation
       * whereas Pixel 3 (Android 12) is not applying layout animation and view changes
       * it's position instantly. We stick to such default behavior and rely on it.
       * Though if we decide to animate always (any animation looks better that instant transition)
       * we can use the code below:
       *
       * <pre>
       *   val animation = ValueAnimator.ofInt(-this.persistentKeyboardHeight, -keyboardHeight)
       *
       *   animation.addUpdateListener { animator ->
       *     val toValue = animator.animatedValue as Int
       *     this.sendEventToJS(KeyboardTransitionEvent(view.id, toValue, 1.0))
       *   }
       *   animation.setDuration(250).startDelay = 0
       *   animation.start()
       * </pre>
       *
       * But for now let's rely on OS preferences.
       */
      this.sendEventToJS(KeyboardTransitionEvent(view.id, -keyboardHeight, 1.0))
      this.emitEvent("KeyboardController::keyboardDidShow", getEventParams(keyboardHeight))

      this.persistentKeyboardHeight = keyboardHeight
    }

    return insets
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

    this.emitEvent("KeyboardController::" + if (!isKeyboardVisible) "keyboardWillHide" else "keyboardWillShow", getEventParams(keyboardHeight))

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

    this.persistentKeyboardHeight = getCurrentKeyboardHeight()
    this.emitEvent("KeyboardController::" + if (!isKeyboardVisible) "keyboardDidHide" else "keyboardDidShow", getEventParams(this.persistentKeyboardHeight))
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
