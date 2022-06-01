package com.reactnativekeyboardcontroller

import android.animation.ArgbEvaluator
import android.animation.ValueAnimator
import android.os.Build
import androidx.annotation.RequiresApi
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

// TODO: resolve promises?
class StatusBarManagerCompatModule(private val mReactContext: ReactApplicationContext) : ReactContextBaseJavaModule(mReactContext) {
  private var controller: WindowInsetsControllerCompat? = null

  override fun getName(): String = "StatusBarManagerCompat"

  @ReactMethod
  private fun setHidden(hidden: Boolean, promise: Promise) {
    UiThreadUtil.runOnUiThread {
      if (hidden) {
        getController()?.hide(WindowInsetsCompat.Type.statusBars())
      } else {
        getController()?.show(WindowInsetsCompat.Type.statusBars())
      }
    }
  }

  @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
  @ReactMethod
  private fun setColor(color: Int, animated: Boolean, promise: Promise) {
    UiThreadUtil.runOnUiThread {
      val window = mReactContext.currentActivity!!.window

      if (animated) {
        val curColor: Int = window.statusBarColor
        val colorAnimation = ValueAnimator.ofObject(ArgbEvaluator(), curColor, color)
        colorAnimation.addUpdateListener { animator ->
          window.statusBarColor = animator.animatedValue as Int
        }
        colorAnimation.setDuration(300).startDelay = 0
        colorAnimation.start()
      } else {
        window.statusBarColor = color
      }
    }
    // TODO: animated
  }

  @ReactMethod
  private fun setTranslucent(translucent: Boolean, promise: Promise) {
    // TODO: implement
  }

  @ReactMethod
  private fun setStyle(style: String, promise: Promise) {
    UiThreadUtil.runOnUiThread {
      getController()?.isAppearanceLightStatusBars = style == "dark-content"
    }
  }

  private fun getController(): WindowInsetsControllerCompat? {
    if (this.controller == null) {
      val window = mReactContext.currentActivity!!.window

      this.controller = WindowInsetsControllerCompat(window, window.decorView)
    }

    return this.controller
  }
}
