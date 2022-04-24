package com.reactnativekeyboardcontroller

import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.events.KeyboardTransitionEvent

class KeyboardControllerViewManager(reactContext: ReactApplicationContext?) : ReactViewManager() {
  private var mReactContext = reactContext

  override fun getName() = "KeyboardControllerView"

  override fun createViewInstance(reactContext: ThemedReactContext): ReactViewGroup {
    val view = ReactViewGroup(reactContext)

    ViewCompat.setWindowInsetsAnimationCallback(
      reactContext.currentActivity!!.window!!.decorView,
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

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
    val map: MutableMap<String, Any> = MapBuilder.of(
      KeyboardTransitionEvent.EVENT_NAME,
      MapBuilder.of("registrationName", "onKeyboardMove")
    )

    return map
  }
}
