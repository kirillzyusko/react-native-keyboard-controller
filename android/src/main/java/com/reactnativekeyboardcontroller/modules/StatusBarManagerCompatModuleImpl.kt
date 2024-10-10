package com.reactnativekeyboardcontroller.modules

import android.animation.ArgbEvaluator
import android.animation.ValueAnimator
import android.app.Activity
import android.os.Build
import androidx.annotation.RequiresApi
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import com.reactnativekeyboardcontroller.extensions.rootView
import com.reactnativekeyboardcontroller.log.Logger
import com.reactnativekeyboardcontroller.views.EdgeToEdgeReactViewGroup
import java.lang.ref.WeakReference

private val TAG = StatusBarManagerCompatModuleImpl::class.qualifiedName

class StatusBarManagerCompatModuleImpl(
  private val mReactContext: ReactApplicationContext,
) {
  private var controller: WindowInsetsControllerCompat? = null
  private var lastActivity = WeakReference<Activity?>(null)

  fun setHidden(hidden: Boolean) {
    UiThreadUtil.runOnUiThread {
      if (hidden) {
        getController()?.hide(WindowInsetsCompat.Type.statusBars())
      } else {
        getController()?.show(WindowInsetsCompat.Type.statusBars())
      }
    }
  }

  @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
  fun setColor(
    color: Int,
    animated: Boolean,
  ) {
    val activity = mReactContext.currentActivity
    if (activity == null) {
      Logger.w(TAG, "StatusBarManagerCompatModule: Ignored status bar change, current activity is null.")
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

  fun setTranslucent(translucent: Boolean) {
    UiThreadUtil.runOnUiThread {
      val view = mReactContext.rootView?.findViewWithTag<EdgeToEdgeReactViewGroup>(EdgeToEdgeReactViewGroup.VIEW_TAG)
      view?.forceStatusBarTranslucent(translucent)
    }
  }

  fun setStyle(style: String) {
    UiThreadUtil.runOnUiThread {
      getController()?.isAppearanceLightStatusBars = style == "dark-content"
    }
  }

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

  companion object {
    const val NAME = "StatusBarManagerCompat"
    private const val DEFAULT_ANIMATION_TIME = 300L
  }
}
