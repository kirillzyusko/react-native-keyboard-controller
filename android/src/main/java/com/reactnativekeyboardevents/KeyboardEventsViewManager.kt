package com.reactnativekeyboardevents

import android.view.View
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import androidx.core.view.ViewCompat

import com.reactnativekeyboardevents.events.KeyboardTransitionEvent

class KeyboardEventsViewManager : SimpleViewManager<View>() {
  var mCallerContext: ReactApplicationContext? = null

  fun KeyboardEventsViewManager(reactContext: ReactApplicationContext?) {
    mCallerContext = reactContext

    ViewCompat.setWindowInsetsAnimationCallback(
      binding.messageHolder,
      TranslateDeferringInsetsAnimationCallback(
        view = binding.messageHolder,
        persistentInsetTypes = WindowInsetsCompat.Type.systemBars(),
        deferredInsetTypes = WindowInsetsCompat.Type.ime(),
        // We explicitly allow dispatch to continue down to binding.messageHolder's
        // child views, so that step 2.5 below receives the call
        dispatchMode = WindowInsetsAnimationCompat.Callback.DISPATCH_MODE_CONTINUE_ON_SUBTREE
      )
    )
  }

  override fun getName() = "KeyboardEventsView"

  override fun createViewInstance(reactContext: ThemedReactContext): View {
    return View(reactContext)
  }

  override fun getExportedCustomBubblingEventTypeConstants(): MutableMap? {
    val map: MutableMap<String, Any> = MapBuilder.of(
      KeyboardTransitionEvent.EVENT_NAME,
      MapBuilder.of("registrationName", "onProgress")
    )

    return map
  }
}
