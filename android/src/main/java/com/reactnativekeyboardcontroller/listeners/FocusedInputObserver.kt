package com.reactnativekeyboardcontroller.listeners

import android.text.TextWatcher
import android.view.View
import android.view.View.OnLayoutChangeListener
import android.view.ViewTreeObserver.OnGlobalFocusChangeListener
import android.widget.EditText
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.events.FocusedInputLayoutChangedEvent
import com.reactnativekeyboardcontroller.events.FocusedInputLayoutChangedEventData
import com.reactnativekeyboardcontroller.events.FocusedInputSelectionChangedEvent
import com.reactnativekeyboardcontroller.events.FocusedInputSelectionChangedEventData
import com.reactnativekeyboardcontroller.events.FocusedInputTextChangedEvent
import com.reactnativekeyboardcontroller.extensions.addOnSelectionChangedListener
import com.reactnativekeyboardcontroller.extensions.addOnTextChangedListener
import com.reactnativekeyboardcontroller.extensions.dispatchEvent
import com.reactnativekeyboardcontroller.extensions.dp
import com.reactnativekeyboardcontroller.extensions.emitEvent
import com.reactnativekeyboardcontroller.extensions.parentScrollViewTarget
import com.reactnativekeyboardcontroller.extensions.rootView
import com.reactnativekeyboardcontroller.extensions.screenLocation
import com.reactnativekeyboardcontroller.traversal.FocusedInputHolder
import com.reactnativekeyboardcontroller.traversal.ViewHierarchyNavigator

val noFocusedInputEvent =
  FocusedInputLayoutChangedEventData(
    x = 0.0,
    y = 0.0,
    width = 0.0,
    height = 0.0,
    absoluteX = 0.0,
    absoluteY = 0.0,
    target = -1,
    parentScrollViewTarget = -1,
  )

class FocusedInputObserver(
  val view: View,
  private val eventPropagationView: ReactViewGroup,
  private val context: ThemedReactContext?,
) {
  // constructor variables
  private val surfaceId = UIManagerHelper.getSurfaceId(view)

  // state variables
  private var lastFocusedInput: EditText? = null
  private var lastEventDispatched: FocusedInputLayoutChangedEventData = noFocusedInputEvent
  private var textWatcher: TextWatcher? = null
  private var selectionSubscription: (() -> Unit)? = null

  // listeners
  private val layoutListener =
    OnLayoutChangeListener { v, left, top, right, bottom, oldLeft, oldTop, oldRight, oldBottom ->
      this.syncUpLayout()
    }
  private val textListener: (String) -> Unit = { text ->
    syncUpLayout()
    context.dispatchEvent(
      eventPropagationView.id,
      FocusedInputTextChangedEvent(
        surfaceId,
        eventPropagationView.id,
        text = text,
      ),
    )
  }
  private val selectionListener: (
    start: Int,
    end: Int,
    startX: Double,
    startY: Double,
    endX: Double,
    endY: Double,
  ) -> Unit = listener@{ start, end, startX, startY, endX, endY ->
    val input = lastFocusedInput ?: return@listener

    syncUpLayout()
    context.dispatchEvent(
      eventPropagationView.id,
      FocusedInputSelectionChangedEvent(
        surfaceId,
        eventPropagationView.id,
        event =
          FocusedInputSelectionChangedEventData(
            target = input.id,
            start = start,
            end = end,
            startX = startX,
            startY = startY,
            endX = endX,
            endY = endY,
          ),
      ),
    )
  }
  private val focusListener =
    OnGlobalFocusChangeListener { oldFocus, newFocus ->
      // unfocused or focus was changed
      if (newFocus == null || oldFocus != null) {
        lastFocusedInput?.removeOnLayoutChangeListener(layoutListener)
        lastFocusedInput?.let { input ->
          val watcher = textWatcher
          // remove it asynchronously to avoid crash in stripe input
          // see https://github.com/stripe/stripe-android/issues/10178
          input.post {
            input.removeTextChangedListener(watcher)
          }
        }
        selectionSubscription?.invoke()
        lastFocusedInput = null
      }
      if (newFocus is EditText) {
        lastFocusedInput = newFocus
        newFocus.addOnLayoutChangeListener(layoutListener)
        this.syncUpLayout()
        textWatcher = newFocus.addOnTextChangedListener(textListener)
        selectionSubscription = newFocus.addOnSelectionChangedListener(selectionListener)
        FocusedInputHolder.set(newFocus)

        val allInputFields = ViewHierarchyNavigator.getAllInputFields(context?.rootView)
        val currentIndex = allInputFields.indexOf(newFocus)

        context.emitEvent(
          "KeyboardController::focusDidSet",
          Arguments.createMap().apply {
            putInt("current", currentIndex)
            putInt("count", allInputFields.size)
          },
        )
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
    val event =
      FocusedInputLayoutChangedEventData(
        x = input.x.dp,
        y = input.y.dp,
        width = input.width.toFloat().dp,
        height = input.height.toFloat().dp,
        absoluteX = x.toFloat().dp,
        absoluteY = y.toFloat().dp,
        target = input.id,
        parentScrollViewTarget = input.parentScrollViewTarget,
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
        eventPropagationView.id,
        FocusedInputLayoutChangedEvent(
          surfaceId,
          eventPropagationView.id,
          event = event,
        ),
      )
    }
  }
}
