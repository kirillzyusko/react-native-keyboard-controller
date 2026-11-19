package com.reactnativekeyboardcontroller.modal

import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import androidx.core.view.ViewCompat
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcherListener
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.constants.Keyboard
import com.reactnativekeyboardcontroller.extensions.eventDispatcher
import com.reactnativekeyboardcontroller.extensions.removeSelf
import com.reactnativekeyboardcontroller.extensions.uiManager
import com.reactnativekeyboardcontroller.listeners.KeyboardAnimationCallback
import com.reactnativekeyboardcontroller.listeners.KeyboardAnimationCallbackConfig
import com.reactnativekeyboardcontroller.log.Logger
import java.util.Collections
import java.util.WeakHashMap

private val TAG = FocusedWindowWatcher::class.qualifiedName
private val areEventsComingFromOwnWindow = !Keyboard.IS_ANIMATION_EMULATED

/**
 * Windows other than the activity window that currently own keyboard tracking. The activity
 * window callback must stay suspended while any of them does, otherwise two callbacks would
 * dispatch events for the same provider.
 */
internal object SecondaryKeyboardWindows {
  /** Root views of RN `Modal` windows, tracked by [ModalAttachedWatcher]. */
  val modalRootViews: MutableSet<View> = Collections.newSetFromMap(WeakHashMap())

  /** Root views of other windows that hold window focus, tracked by [FocusedWindowWatcher]. */
  val focusedRootViews: MutableSet<View> = Collections.newSetFromMap(WeakHashMap())

  val isActivityWindowSuspended: Boolean
    get() = modalRootViews.isNotEmpty() || focusedRootViews.isNotEmpty()
}

/**
 * Tracks the keyboard for React content that lives in a window other than the activity window
 * or an RN `Modal` (for example a library-owned `Dialog` used as a native overlay).
 *
 * On Android 11+ IME insets and `WindowInsetsAnimation` callbacks are delivered only to the
 * window that owns the focused input, so the provider's callback on the activity window never
 * sees the keyboard. When a React `TextInput` gains focus in such a window, a callback is attached
 * to it. Only a window that holds window focus drives the events: such a window may stay shown
 * in the background (for example a closed, non-focusable overlay), and must not mute the
 * activity window while it does.
 */
class FocusedWindowWatcher(
  private val view: ReactViewGroup,
  private val reactContext: ThemedReactContext,
  private val config: KeyboardAnimationCallbackConfig,
  private var callback: () -> KeyboardAnimationCallback?,
) : EventDispatcherListener {
  private val uiManager = reactContext.uiManager
  private val eventDispatcher = reactContext.eventDispatcher

  // entries are removed when their window detaches, or when the watcher is disabled
  private val windows = HashMap<View, AttachedWindow>()

  override fun onEventDispatch(event: Event<*>) {
    if (!areEventsComingFromOwnWindow || event.eventName != FOCUS_EVENT) {
      return
    }

    val rootView = resolveFocusedInput(event.viewTag)?.rootView as? ViewGroup

    if (rootView != null && isUntrackedSecondaryWindow(rootView)) {
      windows[rootView] = AttachedWindow(rootView)
    }
  }

  private fun resolveFocusedInput(viewTag: Int): EditText? =
    try {
      uiManager?.resolveView(viewTag) as? EditText
    } catch (ignore: Exception) {
      Logger.w(TAG, "Can not resolve view for focused input #$viewTag", ignore)
      null
    }

  private fun isUntrackedSecondaryWindow(rootView: View): Boolean {
    val activityRootView =
      reactContext.currentActivity
        ?.window
        ?.decorView
        ?.rootView

    return rootView !== activityRootView &&
      !windows.containsKey(rootView) &&
      rootView !in SecondaryKeyboardWindows.modalRootViews
  }

  fun enable() {
    eventDispatcher?.addListener(this)
  }

  fun disable() {
    eventDispatcher?.removeListener(this)
    windows.values.toList().forEach { it.detach() }
    windows.clear()
  }

  private inner class AttachedWindow(
    private val rootView: ViewGroup,
  ) : View.OnAttachStateChangeListener {
    private val eventView =
      object : ReactViewGroup(reactContext) {
        override fun onWindowFocusChanged(hasWindowFocus: Boolean) {
          super.onWindowFocusChanged(hasWindowFocus)
          this@AttachedWindow.onWindowFocusChanged(hasWindowFocus)
        }
      }.apply {
        layoutParams = ViewGroup.LayoutParams(0, 0)
      }
    private val windowCallback =
      KeyboardAnimationCallback(
        view = rootView,
        eventPropagationView = view,
        context = reactContext,
        config = config,
      )

    init {
      rootView.addView(eventView)
      ViewCompat.setWindowInsetsAnimationCallback(rootView, windowCallback)
      ViewCompat.setOnApplyWindowInsetsListener(eventView, windowCallback)
      eventView.addOnAttachStateChangeListener(this)
      // an input can only gain focus after its window did, so `eventView`
      // won't be notified about the current state
      onWindowFocusChanged(rootView.hasWindowFocus())
    }

    fun onWindowFocusChanged(hasFocus: Boolean) {
      windowCallback.suspend(!hasFocus)
      if (hasFocus) {
        SecondaryKeyboardWindows.focusedRootViews.add(rootView)
        // the window is attached in response to its input gaining focus, and an input keeps
        // view focus while its window is in the background, so neither case delivers a focus change
        windowCallback.observeFocusedInput()
      } else {
        SecondaryKeyboardWindows.focusedRootViews.remove(rootView)
      }
      updateActivityWindowSuspension()
    }

    override fun onViewAttachedToWindow(v: View) = Unit

    override fun onViewDetachedFromWindow(v: View) {
      windows.remove(rootView)
      detach()
    }

    fun detach() {
      eventView.removeOnAttachStateChangeListener(this)
      ViewCompat.setWindowInsetsAnimationCallback(rootView, null)
      windowCallback.destroy()
      eventView.removeSelf()
      SecondaryKeyboardWindows.focusedRootViews.remove(rootView)
      updateActivityWindowSuspension()
    }

    private fun updateActivityWindowSuspension() {
      val activityCallback = callback() ?: return
      val shouldSuspend = SecondaryKeyboardWindows.isActivityWindowSuspended
      if (activityCallback.isSuspended == shouldSuspend) {
        return
      }
      activityCallback.suspend(shouldSuspend)
      if (!shouldSuspend) {
        // the keyboard either hid or moved back to the activity window while
        // the callback was suspended, and those transitions were not delivered to it
        activityCallback.syncKeyboardPosition()
      }
    }
  }

  companion object {
    private const val FOCUS_EVENT = "topFocus"
  }
}
