/*
 * Copyright 2020 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.reactnativekeyboardcontroller

import android.content.Context
import androidx.core.graphics.Insets
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.events.KeyboardTransitionEvent
import java.util.*

fun toDp(px: Float, context: Context): Int = (px / context.resources.displayMetrics.density).toInt()

/**
 * A [WindowInsetsAnimationCompat.Callback] which will translate/move the given view during any
 * inset animations of the given inset type.
 *
 * This class works in tandem with [RootViewDeferringInsetsCallback] to support the deferring of
 * certain [WindowInsetsCompat.Type] values during a [WindowInsetsAnimationCompat], provided in
 * [deferredInsetTypes]. The values passed into this constructor should match those which
 * the [RootViewDeferringInsetsCallback] is created with.
 *
 * @param view the view to translate from it's start to end state
 * @param persistentInsetTypes the bitmask of any inset types which were handled as part of the
 * layout
 * @param deferredInsetTypes the bitmask of insets types which should be deferred until after
 * any [WindowInsetsAnimationCompat]s have ended
 * @param dispatchMode The dispatch mode for this callback.
 * See [WindowInsetsAnimationCompat.Callback.getDispatchMode].
 */
class TranslateDeferringInsetsAnimationCallback(
  val view: ReactViewGroup,
  val persistentInsetTypes: Int,
  val deferredInsetTypes: Int,
  dispatchMode: Int = DISPATCH_MODE_STOP,
  val context: ReactApplicationContext?
) : WindowInsetsAnimationCompat.Callback(dispatchMode) {
  private var persistentKeyboardHeight = 0

  init {
      require(persistentInsetTypes and deferredInsetTypes == 0) {
          "persistentInsetTypes and deferredInsetTypes can not contain any of " +
                  " same WindowInsetsCompat.Type values"
      }
  }

  override fun onStart(
    animation: WindowInsetsAnimationCompat,
    bounds: WindowInsetsAnimationCompat.BoundsCompat
  ): WindowInsetsAnimationCompat.BoundsCompat {
    val keyboardHeight = getCurrentKeyboardHeight()
    val isKeyboardVisible = isKeyboardVisible()

    if (isKeyboardVisible) {
      // do not update it on hide, since back progress will be invalid
      this.persistentKeyboardHeight = keyboardHeight
    }

    val params: WritableMap = Arguments.createMap()
    params.putInt("height", keyboardHeight)
    context?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)?.emit("KeyboardController::" + if(!isKeyboardVisible) "keyboardWillHide" else "keyboardWillShow", params)

    println("KeyboardController::" + if(!isKeyboardVisible) "keyboardWillHide" else "keyboardWillShow")
    println("HEIGHT:: " + keyboardHeight)

    return super.onStart(animation, bounds)
  }

  override fun onEnd(animation: WindowInsetsAnimationCompat) {
    super.onEnd(animation)

    val isKeyboardVisible = isKeyboardVisible()

    val params: WritableMap = Arguments.createMap()
    context?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)?.emit("KeyboardController::" + if(!isKeyboardVisible) "keyboardDidHide" else "keyboardDidShow", params)

    println("KeyboardController::" + if(!isKeyboardVisible) "keyboardDidHide" else "keyboardDidShow")
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
    return Math.max(toDp((keyboardHeight - navigationBar).toFloat(), context!!), 0)
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
        val height = toDp(diffY, context!!)

        var progress = 0.0
        try {
          progress = Math.abs((height.toDouble() / persistentKeyboardHeight))
        } catch (e: ArithmeticException) {
          // do nothing, send progress as 0
        }

        context
          .getNativeModule(UIManagerModule::class.java)
          ?.eventDispatcher
          ?.dispatchEvent(KeyboardTransitionEvent(view.id, height, progress))

        return insets
    }
}
