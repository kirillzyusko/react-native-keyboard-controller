package com.reactnativekeyboardcontroller.modules.statusbar

import android.animation.ArgbEvaluator
import android.animation.ValueAnimator
import android.annotation.SuppressLint
import android.app.Activity
import android.os.Build
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import com.reactnativekeyboardcontroller.BuildConfig
import com.reactnativekeyboardcontroller.log.Logger
import com.reactnativekeyboardcontroller.views.EdgeToEdgeReactViewGroup
import com.reactnativekeyboardcontroller.views.EdgeToEdgeViewRegistry
import java.lang.ref.WeakReference

private val TAG = StatusBarManagerCompatModuleImpl::class.qualifiedName

class StatusBarManagerCompatModuleImpl(
  private val mReactContext: ReactApplicationContext,
) {
  private var original = StatusBarModuleProxy(mReactContext)
  private var controller: WindowInsetsControllerCompat? = null
  private var lastActivity = WeakReference<Activity?>(null)

  /**
   * This method always uses new API, because original implementation may mess up system insets
   * and they will never be restored properly (even if you enabled edge-to-edge mode etc.)
   */
  fun setHidden(hidden: Boolean) {
    UiThreadUtil.runOnUiThread {
      if (hidden) {
        getController()?.hide(WindowInsetsCompat.Type.statusBars())
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
    if (!isEnabled()) {
      return original.setTranslucent(translucent)
    }

    if (BuildConfig.IS_EDGE_TO_EDGE_ENABLED) {
      Logger.w(TAG, "StatusBarModule: Ignored status bar change, current activity is edge-to-edge.")
      return
    }

    UiThreadUtil.runOnUiThread {
      view()?.forceStatusBarTranslucent(translucent)
    }
  }

  fun setStyle(style: String) {
    if (!isEnabled()) {
      return original.setStyle(style)
    }

    UiThreadUtil.runOnUiThread {
      getController()?.isAppearanceLightStatusBars = style == "dark-content"
    }
  }

  fun getConstants(): MutableMap<String, Any>? = original.getConstants()

  private fun getController(): WindowInsetsControllerCompat? {
    val activity = mReactContext.currentActivity

    if (this.controller == null || activity != lastActivity.get()) {
      if (activity == null) {
        Logger.w(
          TAG,
          "StatusBarManagerCompatModule: can not get `WindowInsetsControllerCompat` because current activity is null.",
        )
        return this.controller
      }

      val window = activity.window
      lastActivity = WeakReference(activity)

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
