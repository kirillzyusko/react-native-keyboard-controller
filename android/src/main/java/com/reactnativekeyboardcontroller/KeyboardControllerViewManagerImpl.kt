package com.reactnativekeyboardcontroller

import android.util.Log
import androidx.appcompat.widget.FitWindowsLinearLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup

class KeyboardControllerViewManagerImpl(reactContext: ReactApplicationContext) {
  private val TAG = KeyboardControllerViewManagerImpl::class.qualifiedName
  private var mReactContext = reactContext
  private var isStatusBarTranslucent = false

  fun createViewInstance(reactContext: ThemedReactContext): ReactViewGroup {
    val view = EdgeToEdgeReactViewGroup(reactContext)
    val activity = mReactContext.currentActivity

    if (activity == null) {
      Log.w(TAG, "Can not setup keyboard animation listener, since `currentActivity` is null")
      return view
    }

    val callback = KeyboardAnimationCallback(
      view = view,
      persistentInsetTypes = WindowInsetsCompat.Type.systemBars(),
      deferredInsetTypes = WindowInsetsCompat.Type.ime(),
      // We explicitly allow dispatch to continue down to binding.messageHolder's
      // child views, so that step 2.5 below receives the call
      dispatchMode = WindowInsetsAnimationCompat.Callback.DISPATCH_MODE_CONTINUE_ON_SUBTREE,
      context = mReactContext,
      onApplyWindowInsetsListener = { v, insets ->
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
    )
    ViewCompat.setWindowInsetsAnimationCallback(view, callback)
    ViewCompat.setOnApplyWindowInsetsListener(view, callback)

    return view
  }

  fun setStatusBarTranslucent(view: ReactViewGroup, isStatusBarTranslucent: Boolean) {
    this.isStatusBarTranslucent = isStatusBarTranslucent
  }

  fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
    val map: MutableMap<String, Any> = MapBuilder.of(
      "topKeyboardMove",
      MapBuilder.of("registrationName", "onKeyboardMove"),
      "topKeyboardMoveStart",
      MapBuilder.of("registrationName", "onKeyboardMoveStart"),
      "topKeyboardMoveEnd",
      MapBuilder.of("registrationName", "onKeyboardMoveEnd"),
    )

    return map
  }

  companion object {
    const val NAME = "KeyboardControllerView"
  }
}
