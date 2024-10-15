package com.reactnativekeyboardcontroller.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

@Suppress("detekt:LongParameterList")
class KeyboardTransitionEvent(
  surfaceId: Int,
  viewId: Int,
  private val event: EventName,
  private val height: Double,
  private val progress: Double,
  private val duration: Int,
  private val target: Int,
) : Event<KeyboardTransitionEvent>(surfaceId, viewId) {
  override fun getEventName() = event.value

  // All events for a given view can be coalesced?
  override fun getCoalescingKey(): Short = 0

  override fun getEventData(): WritableMap? =
    Arguments.createMap().apply {
      putDouble("progress", progress)
      putDouble("height", height)
      putInt("duration", duration)
      putInt("target", target)
    }

  companion object {
    const val MOVE_EVENT_NAME = "topKeyboardMove"
    const val START_EVENT_NAME = "topKeyboardMoveStart"
    const val END_EVENT_NAME = "topKeyboardMoveEnd"
    const val INTERACTIVE_EVENT_NAME = "topKeyboardMoveInteractive"

    enum class EventName(val value: String) {
      Move(MOVE_EVENT_NAME),
      Start(START_EVENT_NAME),
      End(END_EVENT_NAME),
      Interactive(INTERACTIVE_EVENT_NAME)
    }

    val Move get() = EventName.Move
    val Start get() = EventName.Start
    val End get() = EventName.End
    val Interactive get() = EventName.Interactive
  }
}
