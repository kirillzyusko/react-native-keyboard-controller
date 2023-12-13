package com.reactnativekeyboardcontroller.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class FocusedInputTextChangedEvent(
  surfaceId: Int,
  viewId: Int,
  private val text: String,
) : Event<KeyboardTransitionEvent>(surfaceId, viewId) {
  override fun getEventName() = "topFocusedInputTextChanged"

  // All events for a given view can be coalesced
  override fun getCoalescingKey(): Short = 0

  override fun getEventData(): WritableMap? = Arguments.createMap().apply {
    putString("text", text)
  }
}
