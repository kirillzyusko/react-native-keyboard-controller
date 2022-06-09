package com.reactnativekeyboardcontroller

import androidx.appcompat.widget.FitWindowsLinearLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.events.KeyboardTransitionEvent

class KeyboardControllerViewManager(reactContext: ReactApplicationContext) : ReactViewManager() {
  private var mReactContext = reactContext
  private var isStatusBarTranslucent = false

  override fun getName() = "KeyboardControllerView"

  override fun createViewInstance(reactContext: ThemedReactContext): ReactViewGroup {
    val view = EdgeToEdgeReactViewGroup(reactContext)
    val window = mReactContext.currentActivity!!.window
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

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
    val map: MutableMap<String, Any> = MapBuilder.of(
      KeyboardTransitionEvent.EVENT_NAME,
      MapBuilder.of("registrationName", "onKeyboardMove")
    )

    return map
  }
}
