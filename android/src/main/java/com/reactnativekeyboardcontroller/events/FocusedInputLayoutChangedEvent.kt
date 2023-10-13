package com.reactnativekeyboardcontroller.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class FocusedInputLayoutChangedEvent(
  surfaceId: Int,
  viewId: Int,
  private val x: Int,
  private val y: Int,
  private val width: Int,
  private val height: Int,
  private val absoluteX: Int,
  private val absoluteY: Int,
  private val target: Int,
) : Event<KeyboardTransitionEvent>(surfaceId, viewId) {
  override fun getEventName() = "topFocusedInputLayoutChanged"

  // All events for a given view can be coalesced
  override fun getCoalescingKey(): Short = 0

  override fun getEventData(): WritableMap? = Arguments.createMap().apply {
    putInt("target", target)
    putMap(
      "layout",
      Arguments.createMap().apply {
        putInt("x", x)
        putInt("y", y)
        putInt("width", width)
        putInt("height", height)
        putInt("absoluteX", absoluteX)
        putInt("absoluteY", absoluteY)
      },
    )
  }
}
