package com.reactnativekeyboardcontroller.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

data class KeyboardTransitionEventData(
  val event: String,
  val height: Double,
  val progress: Double,
  val duration: Int,
  val target: Int,
)

@Suppress("detekt:LongParameterList")
class KeyboardTransitionEvent(
  surfaceId: Int,
  viewId: Int,
  private val data: KeyboardTransitionEventData,
) : Event<KeyboardTransitionEvent>(surfaceId, viewId) {
  override fun getEventName() = data.event

  // All events for a given view can be coalesced?
  override fun getCoalescingKey(): Short = 0

  override fun getEventData(): WritableMap? = Arguments.createMap().apply {
    putDouble("progress", data.progress)
    putDouble("height", data.height)
    putInt("duration", data.duration)
    putInt("target", data.target)
  }
}
