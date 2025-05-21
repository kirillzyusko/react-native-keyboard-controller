package com.reactnativekeyboardcontroller.extensions

import android.content.Context
import android.os.Build
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcher
import com.reactnativekeyboardcontroller.listeners.WindowDimensionListener
import com.reactnativekeyboardcontroller.log.Logger

fun ThemedReactContext.setupWindowDimensionsListener() {
  WindowDimensionListener(this)
}

fun ThemedReactContext?.dispatchEvent(
  viewId: Int,
  event: Event<*>,
) {
  val eventDispatcher: EventDispatcher? =
    UIManagerHelper.getEventDispatcherForReactTag(this as ReactContext, viewId)
  eventDispatcher?.dispatchEvent(event)
}

fun ThemedReactContext?.emitEvent(
  event: String,
  params: WritableMap,
) {
  this
    ?.reactApplicationContext
    ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    ?.emit(event, params)

  Logger.i("ThemedReactContext", event)
}

fun ThemedReactContext?.keepShadowNodesInSync(viewId: Int) {
  // originally by viewId we should lookup all connected nodes
  // and send them to JS
  // but at the moment JS side broadcasts events to all ViewType
  // instances, so we can send even empty array
  val tags = intArrayOf(viewId)

  val tagsArray = Arguments.createArray()
  for (tag in tags) {
    tagsArray.pushInt(tag)
  }

  // emit the event to JS to re-sync the trees
  val onAnimationEndedData = Arguments.createMap()
  onAnimationEndedData.putArray("tags", tagsArray)

  this?.reactApplicationContext?.emitDeviceEvent("onUserDrivenAnimationEnded", onAnimationEndedData)
}

val ThemedReactContext?.appearance: String
  get() =
    when {
      this == null -> "default"
      isSystemDarkMode(this) -> "dark"
      else -> "light"
    }

private fun isSystemDarkMode(context: Context): Boolean =
  if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
    (context.getSystemService(Context.UI_MODE_SERVICE) as? android.app.UiModeManager)
      ?.nightMode == android.app.UiModeManager.MODE_NIGHT_YES
  } else {
    false
  }
