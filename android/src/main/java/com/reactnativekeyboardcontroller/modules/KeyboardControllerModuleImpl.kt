package com.reactnativekeyboardcontroller.modules

import android.content.Context
import android.os.Build
import android.view.View
import android.view.WindowManager
import android.view.inputmethod.InputMethodManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import com.reactnativekeyboardcontroller.interactive.KeyboardAnimationController
import com.reactnativekeyboardcontroller.traversal.FocusedInputHolder
import com.reactnativekeyboardcontroller.traversal.ViewHierarchyNavigator

class KeyboardControllerModuleImpl(
  private val mReactContext: ReactApplicationContext,
) {
  private val controller = KeyboardAnimationController()
  private val mDefaultMode: Int = getCurrentMode()

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

  private fun setSoftInputMode(mode: Int) {
    UiThreadUtil.runOnUiThread {
      if (getCurrentMode() != mode) {
        mReactContext.currentActivity?.window?.setSoftInputMode(mode)
      }
    }
  }

  private fun getCurrentMode(): Int =
    mReactContext
      .currentActivity
      ?.window
      ?.attributes
      ?.softInputMode
      ?: WindowManager.LayoutParams.SOFT_INPUT_STATE_UNSPECIFIED

  companion object {
    const val NAME = "KeyboardController"
  }
}
