package com.reactnativekeyboardcontroller.listeners

import android.view.View.OnLayoutChangeListener
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.textinput.ReactEditText
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.events.FocusedInputLayoutChangedEvent
import com.reactnativekeyboardcontroller.extensions.dp
import com.reactnativekeyboardcontroller.extensions.screenLocation

class FocusedInputLayoutObserver(val view: ReactViewGroup, private val context: ThemedReactContext?) {
  // constructor variables
  private val surfaceId = UIManagerHelper.getSurfaceId(view)

  // state variables
  private var lastFocusedInput: ReactEditText? = null

  // listeners
  private val layoutListener =
    OnLayoutChangeListener { v, left, top, right, bottom, oldLeft, oldTop, oldRight, oldBottom ->
      this.updateJSValue()
    }

  init {
    view.viewTreeObserver.addOnGlobalFocusChangeListener { oldFocus, newFocus ->
      if (newFocus is ReactEditText) {
        lastFocusedInput = newFocus
        newFocus.addOnLayoutChangeListener(layoutListener)
        this.updateJSValue()
      }
      if (newFocus == null) {
        lastFocusedInput?.removeOnLayoutChangeListener(layoutListener)
        lastFocusedInput = null
      }
    }
  }

  private fun updateJSValue() {
    val input = lastFocusedInput ?: return

    val (x, y) = input.screenLocation
    this.sendEventToJS(FocusedInputLayoutChangedEvent(surfaceId, view.id, input.x.dp.toInt(), input.y.dp.toInt(), input.width.toFloat().dp.toInt(), input.height.toFloat().dp.toInt(), x.toFloat().dp.toInt(), y.toFloat().dp.toInt(), input.id))
  }

  // TODO: remove code duplication
  private fun sendEventToJS(event: Event<*>) {
    val eventDispatcher: EventDispatcher? =
      UIManagerHelper.getEventDispatcherForReactTag(context, view.id)
    eventDispatcher?.dispatchEvent(event)
  }
}
