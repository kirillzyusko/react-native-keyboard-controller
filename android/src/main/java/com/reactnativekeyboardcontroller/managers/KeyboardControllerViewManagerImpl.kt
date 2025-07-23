package com.reactnativekeyboardcontroller.managers

import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.events.FocusedInputLayoutChangedEvent
import com.reactnativekeyboardcontroller.events.FocusedInputSelectionChangedEvent
import com.reactnativekeyboardcontroller.events.FocusedInputTextChangedEvent
import com.reactnativekeyboardcontroller.events.KeyboardTransitionEvent
import com.reactnativekeyboardcontroller.listeners.WindowDimensionListener
import com.reactnativekeyboardcontroller.views.EdgeToEdgeReactViewGroup

class KeyboardControllerViewManagerImpl {
  private var listener: WindowDimensionListener? = null

  fun createViewInstance(reactContext: ThemedReactContext): EdgeToEdgeReactViewGroup {
    if (listener == null) {
      listener = WindowDimensionListener(reactContext)
      listener?.attachListener()
    }
    return EdgeToEdgeReactViewGroup(reactContext)
  }

  fun invalidate() {
    listener?.detachListener()
    listener = null
  }

  fun setEnabled(
    view: EdgeToEdgeReactViewGroup,
    enabled: Boolean,
  ) {
    view.active = enabled
  }

  fun setStatusBarTranslucent(
    view: EdgeToEdgeReactViewGroup,
    isStatusBarTranslucent: Boolean,
  ) {
    view.setStatusBarTranslucent(isStatusBarTranslucent)
  }

  fun setNavigationBarTranslucent(
    view: EdgeToEdgeReactViewGroup,
    isNavigationBarTranslucent: Boolean,
  ) {
    view.setNavigationBarTranslucent(isNavigationBarTranslucent)
  }

  fun setPreserveEdgeToEdge(
    view: EdgeToEdgeReactViewGroup,
    isPreservingEdgeToEdge: Boolean,
  ) {
    view.setPreserveEdgeToEdge(isPreservingEdgeToEdge)
  }

  fun setEdgeToEdge(view: EdgeToEdgeReactViewGroup) {
    view.setEdgeToEdge()
  }

  fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
    val map: MutableMap<String, Any> =
      MapBuilder.of(
        KeyboardTransitionEvent.Move.value,
        MapBuilder.of("registrationName", "onKeyboardMove"),
        KeyboardTransitionEvent.Start.value,
        MapBuilder.of("registrationName", "onKeyboardMoveStart"),
        KeyboardTransitionEvent.End.value,
        MapBuilder.of("registrationName", "onKeyboardMoveEnd"),
        KeyboardTransitionEvent.Interactive.value,
        MapBuilder.of("registrationName", "onKeyboardMoveInteractive"),
        FocusedInputLayoutChangedEvent.EVENT_NAME,
        MapBuilder.of("registrationName", "onFocusedInputLayoutChanged"),
        FocusedInputTextChangedEvent.EVENT_NAME,
        MapBuilder.of("registrationName", "onFocusedInputTextChanged"),
        FocusedInputSelectionChangedEvent.EVENT_NAME,
        MapBuilder.of("registrationName", "onFocusedInputSelectionChanged"),
      )

    return map
  }

  companion object {
    const val NAME = "KeyboardControllerView"
  }
}
