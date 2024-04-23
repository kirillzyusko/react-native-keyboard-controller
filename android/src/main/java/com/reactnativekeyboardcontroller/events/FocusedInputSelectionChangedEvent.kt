package com.reactnativekeyboardcontroller.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

data class FocusedInputSelectionChangedEventData(
  val startX: Double,
  val startY: Double,
  val endX: Double,
  val endY: Double,
  val start: Int,
  val end: Int,
)

class FocusedInputSelectionChangedEvent(
  surfaceId: Int,
  viewId: Int,
  private val event: FocusedInputSelectionChangedEventData,
) : Event<FocusedInputSelectionChangedEvent>(surfaceId, viewId) {
  override fun getEventName() = "topFocusedInputSelectionChanged"

  // All events for a given view can be coalesced
  override fun getCoalescingKey(): Short = 0

  override fun getEventData(): WritableMap? = Arguments.createMap().apply {
    putMap(
      "position",
      Arguments.createMap().apply {
        putInt("start", event.start)
        putInt("end", event.end)
      },
    )
    putMap(
      "coordinates",
      Arguments.createMap().apply {
        putMap(
          "start",
          Arguments.createMap().apply {
            putDouble("x", event.startX)
            putDouble("y", event.startY)
          },
        )
        putMap(
          "end",
          Arguments.createMap().apply {
            putDouble("x", event.endX)
            putDouble("y", event.endY)
          },
        )
      },
    )
  }
}
