package com.reactnativekeyboardevents.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

class KeyboardTransitionEvent(viewId: Int, private val diffY: Float) : Event<KeyboardTransitionEvent>(viewId) {
  override fun getEventName() = EVENT_NAME

  // TODO: All events for a given view can be coalesced?
  override fun getCoalescingKey(): Short = 0

  override fun dispatch(rctEventEmitter: RCTEventEmitter) {
    val map = Arguments.createMap()
    map.putDouble("progress", diffY.toDouble())
    rctEventEmitter.receiveEvent(viewTag, eventName, map)
  }

  companion object {
    const val EVENT_NAME = "topProgress"
  }
}
