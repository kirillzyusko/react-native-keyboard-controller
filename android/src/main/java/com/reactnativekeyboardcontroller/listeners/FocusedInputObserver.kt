package com.reactnativekeyboardcontroller.listeners

import android.text.Editable
import android.text.TextWatcher
import android.view.View.OnLayoutChangeListener
import android.view.ViewTreeObserver.OnGlobalFocusChangeListener
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.textinput.ReactEditText
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.events.FocusedInputLayoutChangedEvent
import com.reactnativekeyboardcontroller.events.FocusedInputLayoutChangedEventData
import com.reactnativekeyboardcontroller.events.FocusedInputTextChangedEvent
import com.reactnativekeyboardcontroller.extensions.dispatchEvent
import com.reactnativekeyboardcontroller.extensions.dp
import com.reactnativekeyboardcontroller.extensions.screenLocation

val noFocusedInputEvent = FocusedInputLayoutChangedEventData(
  x = 0.0,
  y = 0.0,
  width = 0.0,
  height = 0.0,
  absoluteX = 0.0,
  absoluteY = 0.0,
  target = -1,
)

class FocusedInputObserver(val view: ReactViewGroup, private val context: ThemedReactContext?) {
  // constructor variables
  private val surfaceId = UIManagerHelper.getSurfaceId(view)

  // state variables
  private var lastFocusedInput: ReactEditText? = null
  private var lastEventDispatched: FocusedInputLayoutChangedEventData = noFocusedInputEvent

  // listeners
  private val layoutListener =
    OnLayoutChangeListener { v, left, top, right, bottom, oldLeft, oldTop, oldRight, oldBottom ->
      this.syncUpLayout()
    }
  private val textListener = object : TextWatcher {
    @Suppress("detekt:EmptyFunctionBlock")
    override fun afterTextChanged(s: Editable?) {}

    @Suppress("detekt:EmptyFunctionBlock")
    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
      // this callback for some reasons called two times, but it's relatively safe
      // because RN will coalesce these events into a single one
      syncUpLayout()
      context.dispatchEvent(
        view.id,
        FocusedInputTextChangedEvent(
          surfaceId,
          view.id,
          text = s.toString(),
        ),
      )
    }
  }
  private val focusListener = OnGlobalFocusChangeListener { oldFocus, newFocus ->
    // unfocused or focused was changed
    if (newFocus == null || oldFocus != null) {
      lastFocusedInput?.removeOnLayoutChangeListener(layoutListener)
      lastFocusedInput?.removeTextChangedListener(textListener)
      lastFocusedInput = null
    }
    if (newFocus is ReactEditText) {
      lastFocusedInput = newFocus
      newFocus.addOnLayoutChangeListener(layoutListener)
      this.syncUpLayout()
      newFocus.addTextChangedListener(textListener)
    }
    // unfocused
    if (newFocus == null) {
      dispatchEventToJS(noFocusedInputEvent)
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

    dispatchEventToJS(event)
  }

  fun destroy() {
    view.viewTreeObserver.removeOnGlobalFocusChangeListener(focusListener)
  }

  private fun dispatchEventToJS(event: FocusedInputLayoutChangedEventData) {
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
    }
  }
}
