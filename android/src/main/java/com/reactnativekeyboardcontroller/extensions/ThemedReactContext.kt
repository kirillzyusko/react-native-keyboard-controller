package com.reactnativekeyboardcontroller.extensions

import android.content.res.Configuration
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

val ThemedReactContext?.appearance: String
  get() =
    this?.let {
      when (it.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) {
        Configuration.UI_MODE_NIGHT_NO -> "light"
        Configuration.UI_MODE_NIGHT_YES -> "dark"
        else -> "default"
      }
    } ?: "default"
