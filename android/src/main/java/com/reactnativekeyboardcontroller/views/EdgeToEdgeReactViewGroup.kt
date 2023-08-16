package com.reactnativekeyboardcontroller.views

import android.annotation.SuppressLint
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.FrameLayout
import androidx.appcompat.widget.FitWindowsLinearLayout
import androidx.core.view.*
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.KeyboardAnimationCallback
import com.reactnativekeyboardcontroller.extensions.requestApplyInsetsWhenAttached

private val TAG = EdgeToEdgeReactViewGroup::class.qualifiedName

@SuppressLint("ViewConstructor")
class EdgeToEdgeReactViewGroup(private val reactContext: ThemedReactContext) : ReactViewGroup(reactContext) {
  private var isStatusBarTranslucent = false
  private var isNavigationBarTranslucent = false

  init {
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

  private fun setupWindowInsets() {
    val v = reactContext.currentActivity?.window?.decorView?.rootView
    if (v != null) {
      ViewCompat.setOnApplyWindowInsetsListener(v) { v, insets ->
        val content =
          reactContext.currentActivity?.window?.decorView?.rootView?.findViewById<FitWindowsLinearLayout>(
            androidx.appcompat.R.id.action_bar_root,
          )
        println(
          "12121212 ${insets?.getInsets(WindowInsetsCompat.Type.systemBars())?.top}, ${
            insets?.getInsets(
              WindowInsetsCompat.Type.navigationBars()
            )?.bottom
          }"
        )
        val params = FrameLayout.LayoutParams(
          FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT
        )

        params.setMargins(
          0,
          if (this.isStatusBarTranslucent) 0 else insets?.getInsets(WindowInsetsCompat.Type.systemBars())?.top
            ?: 0,
          0,
          if (this.isNavigationBarTranslucent) 0 else insets?.getInsets(WindowInsetsCompat.Type.navigationBars())?.bottom
            ?: 0
        )

        content?.layoutParams = params

        insets
      }
    }
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    Handler(Looper.getMainLooper()).post(this::setupWindowInsets)
    reactContext.currentActivity?.let {
      WindowCompat.setDecorFitsSystemWindows(
        it.window,
        false,
      )
    }
  }

  fun setStatusBarTranslucent(isStatusBarTranslucent: Boolean) {
    this.isStatusBarTranslucent = isStatusBarTranslucent
  }

  fun setNavigationBarTranslucent(isNavigationBarTranslucent: Boolean) {
    this.isNavigationBarTranslucent = isNavigationBarTranslucent
  }
}
