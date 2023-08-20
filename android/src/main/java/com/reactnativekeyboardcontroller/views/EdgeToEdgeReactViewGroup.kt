package com.reactnativekeyboardcontroller.views

import android.annotation.SuppressLint
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.WindowInsets
import android.widget.FrameLayout
import androidx.appcompat.widget.FitWindowsLinearLayout
import androidx.core.graphics.Insets
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.KeyboardAnimationCallback
import com.reactnativekeyboardcontroller.extensions.removeSelf
import com.reactnativekeyboardcontroller.extensions.requestApplyInsetsWhenAttached
import com.reactnativekeyboardcontroller.extensions.rootView

private val TAG = EdgeToEdgeReactViewGroup::class.qualifiedName

// TODO: revert monkey patch when setEnabled(false)
// TODO: fabric
// TODO: check how iOS works

@SuppressLint("ViewConstructor")
class EdgeToEdgeReactViewGroup(private val reactContext: ThemedReactContext) : ReactViewGroup(reactContext) {
  private var isStatusBarTranslucent = false
  private var isNavigationBarTranslucent = false
  private var active = false

  private fun setupWindowInsets() {
    val rootView = reactContext.rootView
    if (rootView != null) {
      ViewCompat.setOnApplyWindowInsetsListener(rootView) { v, insets ->
        // if (active) {
          val content =
            reactContext.rootView?.findViewById<FitWindowsLinearLayout>(
              androidx.appcompat.R.id.action_bar_root,
            )
          val params = FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT,
          )
        val statusBarTranslucent = if (this.isStatusBarTranslucent) {
          0
        } else {
          (insets?.getInsets(WindowInsetsCompat.Type.systemBars())?.top
            ?: 0)
        }

          params.setMargins(
            0,
            if (this.isStatusBarTranslucent) {
              0
            } else {
              (insets?.getInsets(WindowInsetsCompat.Type.systemBars())?.top
                ?: 0)
            },
            0,
            if (!active || this.isNavigationBarTranslucent) {
              0
            } else {
              insets?.getInsets(WindowInsetsCompat.Type.navigationBars())?.bottom
                ?: 0
            },
          )

          println("${params.topMargin} ${params.bottomMargin}")

          content?.layoutParams = params
        // }
        val defaultInsets = ViewCompat.onApplyWindowInsets(v, insets)
        val windowInsets =
          defaultInsets.getInsets(WindowInsetsCompat.Type.statusBars())
val inset = insets?.getInsets(WindowInsetsCompat.Type.systemBars())
        /*WindowInsetsCompat
          .Builder()
          .setInsets(
            WindowInsetsCompat.Type.statusBars(),
            Insets.of(
              windowInsets.left,
              0,
              windowInsets.right,
              windowInsets.bottom,
            )
          )
          .build()*/
        // insets.replaceSystemWindowInsets(windowInsets.left, windowInsets.top, windowInsets.right, windowInsets.bottom)
        /*val inset1 = defaultInsets.getInsets(WindowInsetsCompat.Type.systemBars())
        WindowInsetsCompat
          .Builder()
          .setInsets(
            WindowInsetsCompat.Type.statusBars(),
            Insets.of(
              inset1.left,
              0,
              inset1.right,
              inset1.bottom,
            )
          )
          .build()*/

        defaultInsets.replaceSystemWindowInsets(
          defaultInsets.systemWindowInsetLeft,
          0,
          defaultInsets.systemWindowInsetRight,
          defaultInsets.systemWindowInsetBottom
        )
      }
    }
  }

  private fun setupKeyboardCallbacks() {
    val activity = reactContext.currentActivity

    if (activity != null) {
      val callback = KeyboardAnimationCallback(
        view = this,
        persistentInsetTypes = WindowInsetsCompat.Type.systemBars(),
        deferredInsetTypes = WindowInsetsCompat.Type.ime(),
        // We explicitly allow dispatch to continue down to binding.messageHolder's
        // child views, so that step 2.5 below receives the call
        dispatchMode = WindowInsetsAnimationCompat.Callback.DISPATCH_MODE_CONTINUE_ON_SUBTREE,
        context = reactContext,
      )
      ViewCompat.setWindowInsetsAnimationCallback(this, callback)
      ViewCompat.setOnApplyWindowInsetsListener(this, callback)
      this.requestApplyInsetsWhenAttached()
    } else {
      Log.w(TAG, "Can not setup keyboard animation listener, since `currentActivity` is null")
    }
  }

  private fun bringBackWindowInsets() {
    val rootView = reactContext.rootView
    if (rootView != null) {
      // ViewCompat.setOnApplyWindowInsetsListener(rootView, null)
      val content = reactContext.rootView?.findViewById<FitWindowsLinearLayout>(
        androidx.appcompat.R.id.action_bar_root,
      )

      val params = FrameLayout.LayoutParams(
        FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT
      )
      params.setMargins(0, 0, 0, 0)
      content?.layoutParams = params
    }
  }

  private fun removeKeyboardCallbacks() {
    ViewCompat.setWindowInsetsAnimationCallback(this, null)
    ViewCompat.setOnApplyWindowInsetsListener(this, null)
  }

  private fun enable() {
    // Handler(Looper.getMainLooper()).post(this::setupWindowInsets)
    reactContext.currentActivity?.let {
      WindowCompat.setDecorFitsSystemWindows(
        it.window,
        false,
      )
    }
    this.setupWindowInsets()
    this.setupKeyboardCallbacks()
  }

  private fun disable() {
    // Handler(Looper.getMainLooper()).post(this::bringBackWindowInsets)
    reactContext.currentActivity?.let {
      WindowCompat.setDecorFitsSystemWindows(
        it.window,
        true,
      )
    }
    // this.bringBackWindowInsets()
    this.removeKeyboardCallbacks()
  }

  fun setStatusBarTranslucent(isStatusBarTranslucent: Boolean) {
    this.isStatusBarTranslucent = isStatusBarTranslucent
  }

  fun setNavigationBarTranslucent(isNavigationBarTranslucent: Boolean) {
    this.isNavigationBarTranslucent = isNavigationBarTranslucent
  }

  fun setActive(active: Boolean) {
    this.active = active

    if (active) {
      this.enable()
    } else {
      this.disable()
    }
  }
}
