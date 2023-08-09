package com.reactnativekeyboardcontroller.modules

import android.animation.ArgbEvaluator
import android.animation.ValueAnimator
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil

private val TAG = StatusBarManagerCompatModuleImpl::class.qualifiedName

class StatusBarManagerCompatModuleImpl(private val mReactContext: ReactApplicationContext) {
  private var controller: WindowInsetsControllerCompat? = null

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
  fun setColor(color: Int, animated: Boolean) {
    val activity = mReactContext.currentActivity
    if (activity == null) {
      Log.w(TAG, "StatusBarManagerCompatModule: Ignored status bar change, current activity is null.")
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

  @Suppress("detekt:UnusedParameter")
  fun setTranslucent(translucent: Boolean) {
    // the status bar is translucent by default (once you wrapped App in Provider,
    // and EdgeToEdgeReactViewGroup has been mounted and called
    // `setDecorFitsSystemWindows(window, false)`. By default this library applies default padding
    // which equal to StatusBar height, so it will have a default RN app behavior. Though once you
    // need to set StatusBar as translucent, you will need to use `statusBarTranslucent` prop on
    // `KeyboardProvider` (it will preventing of applying additional padding, and status bar will be
    // translucent. Though it's important to note, that this value is not reactive (i. e. if you change
    // `statusBarTranslucent` in runtime it will not have any effect. Just theoretically I could make
    // it reactive, but I know, that most of apps or don't use StatusBar translucency at all or they are
    // specifying it for entire app, so I don't see a lot of sense to make it reactive as of now. If your
    // app requires to dynamically manage it - just shoot an issue and I will try to add a support fot that.
  }

  fun setStyle(style: String) {
    UiThreadUtil.runOnUiThread {
      getController()?.isAppearanceLightStatusBars = style == "dark-content"
    }
  }

  private fun getController(): WindowInsetsControllerCompat? {
    if (this.controller == null) {
      val activity = mReactContext.currentActivity
      if (activity == null) {
        Log.w(
          TAG,
          "StatusBarManagerCompatModule: can not get `WindowInsetsControllerCompat` because current activity is null.",
        )
        return this.controller
      }

      val window = activity.window

      this.controller = WindowInsetsControllerCompat(window, window.decorView)
    }

    return this.controller
  }

  companion object {
    const val NAME = "StatusBarManagerCompat"
    private const val DEFAULT_ANIMATION_TIME = 300L
  }
}
