package com.reactnativekeyboardcontroller.listeners

import android.annotation.SuppressLint
import android.os.Build
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

@SuppressLint("ObsoleteSdkInt")
class FocusedInputObserver(
  val view: View,
  private val eventPropagationView: ReactViewGroup,
  private val context: ThemedReactContext?,
) {
  // constructor variables
  private val surfaceId = UIManagerHelper.getSurfaceId(eventPropagationView)

  // state variables
  private var lastFocusedInput: EditText? = null
  private var lastLayoutEventDispatched: FocusedInputLayoutChangedEventData = noFocusedInputEvent
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
        stopObservingFocusedInput()
      }
      if (newFocus is EditText) {
        FocusedInputHolder.set(newFocus)
        lastFocusedInput = newFocus
        newFocus.addOnLayoutChangeListener(layoutListener)
        this.syncUpLayout()
        textWatcher = newFocus.addOnTextChangedListener(textListener)
        selectionSubscription = newFocus.addOnSelectionChangedListener(selectionListener)

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
      val input = view.findFocus()
      // `focusListener` is not called when window gets its focus back (e.g. `Modal` was closed),
      // so if another window has replaced the input, we need to restore the one focused in this window
      if (hasFocus && input is EditText && input !== FocusedInputHolder.get()) {
        // JS may hold a layout from another window, so the layout has to be dispatched again
        lastLayoutEventDispatched = noFocusedInputEvent
        focusListener.onGlobalFocusChanged(lastFocusedInput, input)
      }
    }

  init {
    view.viewTreeObserver.addOnGlobalFocusChangeListener(focusListener)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
      view.viewTreeObserver.addOnWindowFocusChangeListener(windowFocusListener)
    }
    // input can be focused before we attach the listener (e.g. `autoFocus` inside `Modal`)
    focusListener.onGlobalFocusChanged(null, view.findFocus())
  }

  /**
   * Starts observing the input that holds focus in [view]'s window, as if it had just gained focus.
   * Needed when the observer is created after that input gained focus, or when the window regains
   * window focus while its input kept view focus: in both cases no focus change is delivered, and
   * another window may have dispatched its own input layout and selection in the meantime.
   */
  fun observeFocusedInput() {
    val focused = view.findFocus() as? EditText ?: return

    stopObservingFocusedInput()
    lastEventDispatched = noFocusedInputEvent
    focusListener.onGlobalFocusChanged(null, focused)
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
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
      view.viewTreeObserver.removeOnWindowFocusChangeListener(windowFocusListener)
    }
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
