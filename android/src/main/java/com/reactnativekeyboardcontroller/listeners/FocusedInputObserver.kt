package com.reactnativekeyboardcontroller.listeners

import android.text.TextWatcher
import android.view.View
import android.view.View.OnLayoutChangeListener
import android.view.ViewTreeObserver.OnGlobalFocusChangeListener
import android.view.ViewTreeObserver.OnWindowFocusChangeListener
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
import com.reactnativekeyboardcontroller.extensions.locationInScrollView
import com.reactnativekeyboardcontroller.extensions.parentScrollView
import com.reactnativekeyboardcontroller.extensions.reactViewTag
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
    contentX = 0.0,
    contentY = 0.0,
    target = -1,
    parentScrollViewTarget = -1,
  )

class FocusedInputObserver(
  val view: View,
  private val eventPropagationView: ReactViewGroup,
  private val context: ThemedReactContext?,
) {
  // constructor variables
  private val surfaceId = UIManagerHelper.getSurfaceId(eventPropagationView)

  // state variables
  private var lastFocusedInput: EditText? = null
  private var lastLayoutEventDispatched: FocusedInputLayoutChangedEventData? = noFocusedInputEvent
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
    OnGlobalFocusChangeListener { _, newFocus ->
      val inputChanged = lastFocusedInput !== newFocus
      // unfocused or focus was changed
      if (inputChanged) {
        stopObservingFocusedInput()
      }
      if (newFocus is EditText) {
        FocusedInputHolder.set(newFocus)
        lastFocusedInput = newFocus
        if (inputChanged) {
          newFocus.addOnLayoutChangeListener(layoutListener)
        }
        this.syncUpLayout()
        if (inputChanged) {
          textWatcher = newFocus.addOnTextChangedListener(textListener)
          selectionSubscription = newFocus.addOnSelectionChangedListener(selectionListener)
        }

        val groupAncestor = ViewHierarchyNavigator.findGroupAncestor(newFocus)
        val allInputFields = ViewHierarchyNavigator.getAllInputFields(groupAncestor ?: context?.rootView)
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
        dispatchLayoutEventToJS(noFocusedInputEvent)
      }
    }
  private val windowFocusListener =
    OnWindowFocusChangeListener { hasFocus ->
      if (hasFocus) {
        syncFocusedInput()
      }
    }

  init {
    view.viewTreeObserver.addOnGlobalFocusChangeListener(focusListener)
    view.viewTreeObserver.addOnWindowFocusChangeListener(windowFocusListener)
    // The input may already be focused when this observer attaches to a Modal.
    syncFocusedInput()
  }

  private fun syncFocusedInput() {
    val input = view.findFocus() as? EditText
    if (lastFocusedInput === input && FocusedInputHolder.get() === input) {
      return
    }

    // Another window may have dispatched its layout since this observer last did.
    lastLayoutEventDispatched = null
    if (input == null) {
      FocusedInputHolder.set(null)
    }
    focusListener.onGlobalFocusChanged(lastFocusedInput, input)
  }

  fun syncUpLayout() {
    val input = FocusedInputHolder.get()?.takeIf { it.isFocused } ?: return

    val (x, y) = input.screenLocation
    val parentScrollView = input.parentScrollView
    val (contentX, contentY) = input.locationInScrollView(parentScrollView)
    val event =
      FocusedInputLayoutChangedEventData(
        x = input.x.dp,
        y = input.y.dp,
        width = input.width.toFloat().dp,
        height = input.height.toFloat().dp,
        absoluteX = x.toFloat().dp,
        absoluteY = y.toFloat().dp,
        contentX = contentX.toFloat().dp,
        contentY = contentY.toFloat().dp,
        target = input.id,
        parentScrollViewTarget = parentScrollView.reactViewTag,
      )

    dispatchLayoutEventToJS(event)
  }

  fun destroy() {
    view.viewTreeObserver.removeOnGlobalFocusChangeListener(focusListener)
    view.viewTreeObserver.removeOnWindowFocusChangeListener(windowFocusListener)
    stopObservingFocusedInput()
  }

  private fun stopObservingFocusedInput() {
    val input = lastFocusedInput
    val watcher = textWatcher
    val unsubscribeFromSelectionChanges = selectionSubscription

    lastFocusedInput = null
    textWatcher = null
    selectionSubscription = null

    input?.removeOnLayoutChangeListener(layoutListener)
    if (input != null && watcher != null) {
      // remove it asynchronously to avoid crash in stripe input
      // see https://github.com/stripe/stripe-android/issues/10178
      input.post {
        input.removeTextChangedListener(watcher)
      }
    }
    unsubscribeFromSelectionChanges?.invoke()
  }

  private fun dispatchLayoutEventToJS(event: FocusedInputLayoutChangedEventData) {
    if (event != lastLayoutEventDispatched) {
      lastLayoutEventDispatched = event
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
