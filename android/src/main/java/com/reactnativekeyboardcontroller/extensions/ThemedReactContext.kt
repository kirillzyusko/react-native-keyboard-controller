package com.reactnativekeyboardcontroller.extensions

import android.util.Log
import android.view.View
import android.view.ViewGroup
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcher

val ThemedReactContext.rootView: View?
  get() = this.currentActivity?.window?.decorView?.rootView

val ThemedReactContext.content: ViewGroup?
  get() = this.currentActivity?.window?.decorView?.rootView?.findViewById(
    androidx.appcompat.R.id.action_bar_root,
  )

fun ThemedReactContext?.dispatchEvent(viewId: Int, event: Event<*>) {
  val eventDispatcher: EventDispatcher? =
    UIManagerHelper.getEventDispatcherForReactTag(this, viewId)
  eventDispatcher?.dispatchEvent(event)
}

fun ThemedReactContext?.emitEvent(event: String, params: WritableMap) {
  this?.reactApplicationContext?.emitDeviceEvent(event, params)

  Log.i("ThemedReactContext", event)
}
