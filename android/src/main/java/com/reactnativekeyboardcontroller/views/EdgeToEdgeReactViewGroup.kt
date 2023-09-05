package com.reactnativekeyboardcontroller.views

import android.annotation.SuppressLint
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.FrameLayout
import androidx.appcompat.widget.FitWindowsLinearLayout
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

@Suppress("detekt:TooManyFunctions")
@SuppressLint("ViewConstructor")
class EdgeToEdgeReactViewGroup(private val reactContext: ThemedReactContext) : ReactViewGroup(reactContext) {
  // props
  private var isStatusBarTranslucent = false
  private var isNavigationBarTranslucent = false
  private var active = false

  // internal class members
  private var eventView: ReactViewGroup? = null
  private var wasAttached = false

  // region View lifecycles
  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    if (!wasAttached) {
      // skip logic with callback re-creation if it was first render/mount
      wasAttached = true
      return
    }

    this.setupKeyboardCallbacks()
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()

    this.removeKeyboardCallbacks()
  }
  // endregion

  // region State manager helpers
  private fun setupWindowInsets() {
    val rootView = reactContext.rootView
    if (rootView != null) {
      ViewCompat.setOnApplyWindowInsetsListener(rootView) { v, insets ->
        val content = getContentView()
        val params = FrameLayout.LayoutParams(
          FrameLayout.LayoutParams.MATCH_PARENT,
          FrameLayout.LayoutParams.MATCH_PARENT,
        )

        val shouldApplyZeroPaddingTop = !active || this.isStatusBarTranslucent
        val shouldApplyZeroPaddingBottom = !active || this.isNavigationBarTranslucent
        params.setMargins(
          0,
          if (shouldApplyZeroPaddingTop) {
            0
          } else {
            (
              insets?.getInsets(WindowInsetsCompat.Type.systemBars())?.top
                ?: 0
              )
          },
          0,
          if (shouldApplyZeroPaddingBottom) {
            0
          } else {
            insets?.getInsets(WindowInsetsCompat.Type.navigationBars())?.bottom
              ?: 0
          },
        )

        println("${params.topMargin} ${params.bottomMargin}")

        content?.layoutParams = params

        val defaultInsets = ViewCompat.onApplyWindowInsets(v, insets)

        defaultInsets.replaceSystemWindowInsets(
          defaultInsets.systemWindowInsetLeft,
          if (this.isStatusBarTranslucent) 0 else defaultInsets.systemWindowInsetTop,
          defaultInsets.systemWindowInsetRight,
          defaultInsets.systemWindowInsetBottom
        )
      }
    }
  }

  private fun setupKeyboardCallbacks() {
    val activity = reactContext.currentActivity

    if (activity != null) {
      eventView = ReactViewGroup(context)
      val root = this.getContentView()
      root?.addView(eventView)

      val callback = KeyboardAnimationCallback(
        view = this,
        persistentInsetTypes = WindowInsetsCompat.Type.systemBars(),
        deferredInsetTypes = WindowInsetsCompat.Type.ime(),
        // We explicitly allow dispatch to continue down to binding.messageHolder's
        // child views, so that step 2.5 below receives the call
        dispatchMode = WindowInsetsAnimationCompat.Callback.DISPATCH_MODE_CONTINUE_ON_SUBTREE,
        context = reactContext,
      )

      eventView?.let {
        ViewCompat.setWindowInsetsAnimationCallback(it, callback)
        ViewCompat.setOnApplyWindowInsetsListener(it, callback)
        it.requestApplyInsetsWhenAttached()
      }
    } else {
      Log.w(TAG, "Can not setup keyboard animation listener, since `currentActivity` is null")
    }
  }

  private fun bringBackWindowInsets() {
    val rootView = reactContext.rootView
    if (rootView != null) {
      // ViewCompat.setOnApplyWindowInsetsListener(rootView, null)
      val content = getContentView()

      val params = FrameLayout.LayoutParams(
        FrameLayout.LayoutParams.MATCH_PARENT,
        FrameLayout.LayoutParams.MATCH_PARENT,
      )
      params.setMargins(0, 0, 0, 0)
      content?.layoutParams = params
    }
  }

  private fun removeKeyboardCallbacks() {
    eventView.removeSelf()
  }
  // endregion

  // region State managers
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
  // endregion

  // region Props setters
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
  // endregion

  private fun getContentView(): FitWindowsLinearLayout? {
    return reactContext.currentActivity?.window?.decorView?.rootView?.findViewById(
      androidx.appcompat.R.id.action_bar_root,
    )
  }
}
