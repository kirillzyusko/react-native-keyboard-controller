package com.reactnativekeyboardcontroller.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

@Suppress("detekt:LongParameterList")
class KeyboardTransitionEvent(
  surfaceId: Int,
  viewId: Int,
  private val event: String,
  private val height: Double,
  private val progress: Double,
  private val duration: Int,
  private val target: Int,
) : Event<KeyboardTransitionEvent>(surfaceId, viewId) {
  override fun getEventName() = event

  // All events for a given view can be coalesced?
  override fun getCoalescingKey(): Short = 0

  override fun getEventData(): WritableMap? = Arguments.createMap().apply {
    putDouble("progress", progress)
    putDouble("height", height)
    putInt("duration", duration)
    putInt("target", target)
  }
}
