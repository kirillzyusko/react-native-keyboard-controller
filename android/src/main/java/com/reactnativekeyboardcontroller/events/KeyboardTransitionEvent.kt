package com.reactnativekeyboardcontroller.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.reactnativekeyboardcontroller.InteractiveKeyboardProvider

class KeyboardTransitionEvent(
  viewId: Int,
  private val event: String,
  private val height: Double,
  private val progress: Double,
  private val duration: Int,
  private val target: Int,
) : Event<KeyboardTransitionEvent>(viewId) {
  override fun getEventName() = event

  // TODO: All events for a given view can be coalesced?
  override fun getCoalescingKey(): Short = 0

  override fun dispatch(rctEventEmitter: RCTEventEmitter) {
    val map = Arguments.createMap()
    map.putDouble("progress", progress)
    map.putDouble("height", height)
    map.putInt("duration", duration)
    map.putInt("target", target)
    rctEventEmitter.receiveEvent(viewTag, eventName, map)
  }
}
