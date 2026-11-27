package com.reactnativekeyboardcontroller.modules.statusbar

import android.animation.ArgbEvaluator
import android.animation.ValueAnimator
import android.annotation.SuppressLint
import android.os.Build
import android.view.Window
import android.view.WindowInsetsController
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import com.reactnativekeyboardcontroller.BuildConfig
import com.reactnativekeyboardcontroller.log.Logger
import com.reactnativekeyboardcontroller.modal.ActiveWindowHolder
import com.reactnativekeyboardcontroller.views.EdgeToEdgeReactViewGroup
import com.reactnativekeyboardcontroller.views.EdgeToEdgeViewRegistry
import java.lang.ref.WeakReference

private val TAG = StatusBarManagerCompatModuleImpl::class.qualifiedName

class StatusBarManagerCompatModuleImpl(
  private val mReactContext: ReactApplicationContext,
) {
  private var original = StatusBarModuleProxy(mReactContext)
  private var controller: WindowInsetsControllerCompat? = null
  private var controllerWindow = WeakReference<Window?>(null)

  /**
   * This method always uses new API, because original implementation may mess up system insets
   * and they will never be restored properly (even if you enabled edge-to-edge mode etc.)
   */
  fun setHidden(hidden: Boolean) {
    UiThreadUtil.runOnUiThread {
      if (hidden) {
        getController()?.run {
          systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
          hide(WindowInsetsCompat.Type.statusBars())
        }
      } else {
        getController()?.show(WindowInsetsCompat.Type.statusBars())
      }
    }
  }

  @SuppressLint("ObsoleteSdkInt")
  @Suppress("detekt:ReturnCount")
  fun setColor(
    color: Int,
    animated: Boolean,
  ) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      if (!isEnabled()) {
        return original.setColor(color.toDouble(), animated)
      }

      if (BuildConfig.IS_EDGE_TO_EDGE_ENABLED) {
        Logger.w(TAG, "StatusBarModule: Ignored status bar change, current activity is edge-to-edge.")
        return
      }

      val activity = mReactContext.currentActivity
      if (activity == null) {
        Logger.w(
          TAG,
          "StatusBarManagerCompatModule: Ignored status bar change, current activity is null.",
        )
        return
      }

      UiThreadUtil.runOnUiThread {
        val window = activity.window

        if (animated) {
          val curColor: Int = window.statusBarColor
          val colorAnimation = ValueAnimator.ofObject(ArgbEvaluator(), curColor, color)
          colorAnimation.addUpdateListener { animator ->
            window.statusBarColor = animator.animatedValue as Int
          }
          colorAnimation.setDuration(DEFAULT_ANIMATION_TIME).startDelay = 0
          colorAnimation.start()
        } else {
          window.statusBarColor = color
        }
      }
    }
  }

  fun setTranslucent(translucent: Boolean) {
    // `<StatusBar />` can call this method before `KeyboardProvider` is mounted, so its state is checked
    // on the UI thread. Otherwise the original implementation replaces the insets listener of
    // `KeyboardProvider` with the one that removes the top inset for the whole view hierarchy.
    UiThreadUtil.runOnUiThread {
      if (!isEnabled()) {
        original.setTranslucent(translucent)
        return@runOnUiThread
      }

      if (BuildConfig.IS_EDGE_TO_EDGE_ENABLED) {
        Logger.w(TAG, "StatusBarModule: Ignored status bar change, current activity is edge-to-edge.")
        return@runOnUiThread
      }

      view()?.forceStatusBarTranslucent(translucent)
    }
  }

  fun setStyle(style: String) {
    if (!isEnabled()) {
      return original.setStyle(style)
    }

    UiThreadUtil.runOnUiThread {
      val isLight = style == "dark-content"
      // keeps the legacy flag in sync: React Native reads it when it copies the style to a new `Modal`
      getController()?.isAppearanceLightStatusBars = isLight
      // on Android 11-14 `WindowInsetsControllerCompat(window, view)` only toggles the legacy flag, which
      // is ignored once the window appearance was set through the platform API (React Native does it
      // for `Modal` windows and while this module is disabled), so the platform API is used as well
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        controllerWindow.get()?.insetsController?.setSystemBarsAppearance(
          if (isLight) WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS else 0,
          WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS,
        )
      }
    }
  }

  fun getConstants(): MutableMap<String, Any>? = original.getConstants()

  private fun getController(): WindowInsetsControllerCompat? {
    // the window of a shown `Modal` covers the activity, so the status bar of that window is visible
    val window = ActiveWindowHolder.get() ?: mReactContext.currentActivity?.window

    if (window == null) {
      Logger.w(
        TAG,
        "StatusBarManagerCompatModule: can not get `WindowInsetsControllerCompat` because current activity is null.",
      )
      return this.controller
    }

    if (this.controller == null || window != controllerWindow.get()) {
      controllerWindow = WeakReference(window)
      this.controller = WindowInsetsControllerCompat(window, window.decorView)
    }

    return this.controller
  }

  private fun isEnabled(): Boolean = view()?.active ?: false

  private fun view(): EdgeToEdgeReactViewGroup? = EdgeToEdgeViewRegistry.get()

  companion object {
    const val NAME = "StatusBarManager"
    private const val DEFAULT_ANIMATION_TIME = 300L
  }
}
