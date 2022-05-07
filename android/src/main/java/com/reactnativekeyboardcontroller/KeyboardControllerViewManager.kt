package com.reactnativekeyboardcontroller

import android.util.Log
import android.content.Context
import android.os.Build
import android.os.CancellationSignal
import android.view.animation.LinearInterpolator
import androidx.annotation.RequiresApi
import androidx.appcompat.widget.FitWindowsLinearLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.graphics.Insets
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.events.KeyboardTransitionEvent

fun toPx(dp: Float, context: Context): Int = (dp * context.resources.displayMetrics.density).toInt()

class KeyboardControllerViewManager(reactContext: ReactApplicationContext) : ReactViewManager() {
  private val TAG = KeyboardControllerViewManager::class.qualifiedName
  private var mReactContext = reactContext
  private var isStatusBarTranslucent = false

  private var animationController: WindowInsetsAnimationControllerCompat? = null
  private val animationControlListener: WindowInsetsAnimationControlListenerCompat by lazy {
    @RequiresApi(Build.VERSION_CODES.R)
    object : WindowInsetsAnimationControlListenerCompat {

      override fun onReady(controller: WindowInsetsAnimationControllerCompat, types: Int) {
        animationController = controller
      }

      override fun onFinished(controller: WindowInsetsAnimationControllerCompat) {
        animationController = null
      }

      override fun onCancelled(controller: WindowInsetsAnimationControllerCompat?) {
        animationController = null
      }
    }
  }
  private var cancellationSignal = CancellationSignal()

  override fun getName() = "KeyboardControllerView"

  override fun createViewInstance(reactContext: ThemedReactContext): ReactViewGroup {
    val view = EdgeToEdgeReactViewGroup(reactContext)
    val activity = mReactContext.currentActivity

    if (activity == null) {
      Log.w(TAG, "Can not setup keyboard animation listener, since `currentActivity` is null")
      return view
    }

    val window = activity.window
    val decorView = window.decorView

    ViewCompat.setOnApplyWindowInsetsListener(view) { v, insets ->
      val content =
        mReactContext.currentActivity?.window?.decorView?.rootView?.findViewById<FitWindowsLinearLayout>(
          R.id.action_bar_root
        )
      content?.setPadding(
        0, if (this.isStatusBarTranslucent) 0 else insets?.getInsets(WindowInsetsCompat.Type.systemBars())?.top ?: 0, 0,
        insets?.getInsets(WindowInsetsCompat.Type.navigationBars())?.bottom ?: 0
      )

      insets
    }

    ViewCompat.setWindowInsetsAnimationCallback(
      decorView,
      TranslateDeferringInsetsAnimationCallback(
        view = view,
        persistentInsetTypes = WindowInsetsCompat.Type.systemBars(),
        deferredInsetTypes = WindowInsetsCompat.Type.ime(),
        // We explicitly allow dispatch to continue down to binding.messageHolder's
        // child views, so that step 2.5 below receives the call
        dispatchMode = WindowInsetsAnimationCompat.Callback.DISPATCH_MODE_CONTINUE_ON_SUBTREE,
        context = mReactContext
      )
    )

    return view
  }

  @ReactProp(name = "statusBarTranslucent")
  fun setStatusBarTranslucent(view: ReactViewGroup, isStatusBarTranslucent: Boolean) {
    this.isStatusBarTranslucent = isStatusBarTranslucent
  }

  @ReactProp(name = "isScrollActive")
  fun setScrollActive(view: ReactViewGroup, isScrollActive: Boolean) {
    val decorView = mReactContext.currentActivity!!.window!!.decorView
    if (isScrollActive && ViewCompat.getRootWindowInsets(decorView)?.isVisible(WindowInsetsCompat.Type.ime()) == true) {
      cancellationSignal = CancellationSignal()
      ViewCompat.getWindowInsetsController(decorView)?.controlWindowInsetsAnimation(
        WindowInsetsCompat.Type.ime(), // types
        -1,                // durationMillis
        LinearInterpolator(),          // interpolator
        cancellationSignal,          // cancellationSignal
        animationControlListener       // listener
      )
    }
  }

  @ReactProp(name = "keyboard")
  fun setKeyboard(view: ReactViewGroup, keyboard: ReadableMap) {
    val opacity = keyboard.getDouble("opacity")
    val position = toPx(keyboard.getDouble("position").toFloat(), mReactContext)

    if (animationController != null && position >= 0) {
      UiThreadUtil.runOnUiThread {
        animationController?.setInsetsAndAlpha(
          Insets.of(0, 0, 0, position),
          opacity.toFloat(),
          0f
        )
      }
    }
    if (position == 0) {
      cancellationSignal.cancel()
    }
  }

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
    val map: MutableMap<String, Any> = MapBuilder.of(
      KeyboardTransitionEvent.EVENT_NAME,
      MapBuilder.of("registrationName", "onKeyboardMove")
    )

    return map
  }
}
