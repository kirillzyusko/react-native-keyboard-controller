package com.reactnativekeyboardcontroller.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class FocusedInputLayoutChangedEvent(
  surfaceId: Int,
  viewId: Int,
  private val x: Double,
  private val y: Double,
  private val width: Double,
  private val height: Double,
  private val absoluteX: Double,
  private val absoluteY: Double,
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
        putDouble("x", x)
        putDouble("y", y)
        putDouble("width", width)
        putDouble("height", height)
        putDouble("absoluteX", absoluteX)
        putDouble("absoluteY", absoluteY)
      },
    )
  }
}
