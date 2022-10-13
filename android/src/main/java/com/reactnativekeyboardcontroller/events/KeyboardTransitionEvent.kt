package com.reactnativekeyboardcontroller.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

class KeyboardTransitionEvent(viewId: Int, private val event: String, private val height: Int, private val progress: Double) : Event<KeyboardTransitionEvent>(viewId) {
  override fun getEventName() = event

  // TODO: All events for a given view can be coalesced?
  override fun getCoalescingKey(): Short = 0

  override fun dispatch(rctEventEmitter: RCTEventEmitter) {
    val map = Arguments.createMap()
    map.putDouble("progress", progress)
    map.putInt("height", height)
    rctEventEmitter.receiveEvent(viewTag, eventName, map)
  }
}
