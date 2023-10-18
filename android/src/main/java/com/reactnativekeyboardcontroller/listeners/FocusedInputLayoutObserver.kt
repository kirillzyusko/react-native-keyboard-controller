package com.reactnativekeyboardcontroller.listeners

import android.view.View.OnLayoutChangeListener
import android.view.ViewTreeObserver.OnGlobalFocusChangeListener
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.textinput.ReactEditText
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.events.FocusedInputLayoutChangedEvent
import com.reactnativekeyboardcontroller.events.FocusedInputLayoutChangedEventData
import com.reactnativekeyboardcontroller.extensions.dispatchEvent
import com.reactnativekeyboardcontroller.extensions.dp
import com.reactnativekeyboardcontroller.extensions.screenLocation

class FocusedInputLayoutObserver(val view: ReactViewGroup, private val context: ThemedReactContext?) {
  // constructor variables
  private val surfaceId = UIManagerHelper.getSurfaceId(view)

  // state variables
  private var lastFocusedInput: ReactEditText? = null
  private var lastEventDispatched: FocusedInputLayoutChangedEventData? = null

  // listeners
  private val layoutListener =
    OnLayoutChangeListener { v, left, top, right, bottom, oldLeft, oldTop, oldRight, oldBottom ->
      this.syncUpLayout()
    }
  private val focusListener = OnGlobalFocusChangeListener { oldFocus, newFocus ->
    // unfocused or focused was changed
    if (newFocus == null || oldFocus != null) {
      lastFocusedInput?.removeOnLayoutChangeListener(layoutListener)
      lastFocusedInput = null
    }
    if (newFocus is ReactEditText) {
      lastFocusedInput = newFocus
      newFocus.addOnLayoutChangeListener(layoutListener)
      this.syncUpLayout()
    }
  }

  init {
    view.viewTreeObserver.addOnGlobalFocusChangeListener(focusListener)
  }

  fun syncUpLayout() {
    val input = lastFocusedInput ?: return

    val (x, y) = input.screenLocation
    val event = FocusedInputLayoutChangedEventData(
      x = input.x.dp,
      y = input.y.dp,
      width = input.width.toFloat().dp,
      height = input.height.toFloat().dp,
      absoluteX = x.toFloat().dp,
      absoluteY = y.toFloat().dp,
      target = input.id,
    )

    if (event != lastEventDispatched) {
      lastEventDispatched = event
      context.dispatchEvent(
        view.id,
        FocusedInputLayoutChangedEvent(
          surfaceId,
          view.id,
          event = event,
        ),
      )
      println("DISPATCH $id")
    }
  }

  fun destroy() {
    view.viewTreeObserver.removeOnGlobalFocusChangeListener(focusListener)
  }
}
