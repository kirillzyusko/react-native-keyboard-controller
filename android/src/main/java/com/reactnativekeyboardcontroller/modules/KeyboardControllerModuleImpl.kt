package com.reactnativekeyboardcontroller.modules

import android.content.Context
import android.os.Build
import android.view.View
import android.view.inputmethod.InputMethodManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import com.reactnativekeyboardcontroller.extensions.dp
import com.reactnativekeyboardcontroller.extensions.screenLocation
import com.reactnativekeyboardcontroller.extensions.uiManager
import com.reactnativekeyboardcontroller.extensions.windowSoftInputMode
import com.reactnativekeyboardcontroller.interactive.KeyboardAnimationController
import com.reactnativekeyboardcontroller.traversal.FocusedInputHolder
import com.reactnativekeyboardcontroller.traversal.ViewHierarchyNavigator

class KeyboardControllerModuleImpl(
  private val mReactContext: ReactApplicationContext,
) {
  private val uiManager = mReactContext.uiManager
  private val controller = KeyboardAnimationController()
  private val mDefaultMode: Int = mReactContext.windowSoftInputMode

  // region Module methods
  fun setInputMode(mode: Int) {
    setSoftInputMode(mode)
  }

  fun setDefaultMode() {
    setSoftInputMode(mDefaultMode)
  }

  fun preload() {
    // no-op on Android
  }

  fun dismiss(
    keepFocus: Boolean,
    animated: Boolean,
  ) {
    val activity = mReactContext.currentActivity
    val view: View? = FocusedInputHolder.get()

    if (view != null) {
      UiThreadUtil.runOnUiThread {
        fun maybeClearFocus() {
          if (!keepFocus) {
            view.clearFocus()
          }
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && !animated) {
          controller.startControlRequest(view) { insetsController ->
            insetsController.finish(false)

            view.post {
              maybeClearFocus()
            }
          }
        } else {
          val imm = activity?.getSystemService(Context.INPUT_METHOD_SERVICE) as? InputMethodManager
          imm?.hideSoftInputFromWindow(view.windowToken, 0)

          maybeClearFocus()
        }
      }
    }
  }

  fun setFocusTo(direction: String) {
    if (direction == "current") {
      UiThreadUtil.runOnUiThread {
        FocusedInputHolder.focus()
      }

      return
    }

    val view: View? = FocusedInputHolder.get()

    if (view != null) {
      ViewHierarchyNavigator.setFocusTo(direction, view)
    }
  }

  fun viewPositionInWindow(
    viewTag: Double,
    promise: Promise,
  ) {
    UiThreadUtil.runOnUiThread {
      val view = uiManager?.resolveView(viewTag.toInt())
      if (view == null) {
        promise.reject("E_VIEW_NOT_FOUND", "Could not find view for tag")
        return@runOnUiThread
      }
      val location = view.screenLocation
      val map = Arguments.createMap()
      map.putDouble("x", location[0].toFloat().dp)
      map.putDouble("y", location[1].toFloat().dp)
      map.putDouble("width", view.width.toFloat().dp)
      map.putDouble("height", view.height.toFloat().dp)
      promise.resolve(map)
    }
  }
  // endregion

  // region Helpers
  private fun setSoftInputMode(mode: Int) {
    UiThreadUtil.runOnUiThread {
      if (mReactContext.windowSoftInputMode != mode) {
        mReactContext.currentActivity?.window?.setSoftInputMode(mode)
      }
    }
  }
  // endregion

  // region Module constants
  fun getConstants(): MutableMap<String, Any> = mutableMapOf("keyboardBorderRadius" to 0)

  companion object {
    const val NAME = "KeyboardController"
  }
  // endregion
}
