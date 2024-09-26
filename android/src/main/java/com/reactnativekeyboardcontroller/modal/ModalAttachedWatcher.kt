package com.reactnativekeyboardcontroller.modal

import android.view.WindowManager
import androidx.core.view.ViewCompat
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcherListener
import com.facebook.react.views.modal.ReactModalHostView
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.BuildConfig
import com.reactnativekeyboardcontroller.listeners.KeyboardAnimationCallback
import com.reactnativekeyboardcontroller.listeners.KeyboardAnimationCallbackConfig
import com.reactnativekeyboardcontroller.log.Logger

private val TAG = ModalAttachedWatcher::class.qualifiedName

class ModalAttachedWatcher(
  private val view: ReactViewGroup,
  private val reactContext: ThemedReactContext,
  private val config: () -> KeyboardAnimationCallbackConfig,
) : EventDispatcherListener {
  private val archType = if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) UIManagerType.FABRIC else UIManagerType.DEFAULT
  private val uiManager = UIManagerHelper.getUIManager(reactContext.reactApplicationContext, archType)
  private val eventDispatcher = UIManagerHelper.getEventDispatcher(reactContext.reactApplicationContext, archType)

  override fun onEventDispatch(event: Event<out Event<*>>?) {
    if (event?.eventName != MODAL_SHOW_EVENT) {
      return
    }

    val modal =
      try {
        uiManager?.resolveView(event.viewTag) as? ReactModalHostView
      } catch (ignore: Exception) {
        Logger.w(TAG, "Can not resolve view for Modal#${event.viewTag}", ignore)
        null
      }

    if (modal == null) {
      return
    }

    val dialog = modal.dialog
    val window = dialog?.window
    val rootView = window?.decorView?.rootView

    if (rootView != null) {
      val callback =
        KeyboardAnimationCallback(
          view = rootView,
          eventPropagationView = view,
          context = reactContext,
          config = config(),
        )

      ViewCompat.setWindowInsetsAnimationCallback(rootView, callback)
      ViewCompat.setOnApplyWindowInsetsListener(rootView, callback)

      dialog.setOnDismissListener {
        callback.syncKeyboardPosition()
        callback.destroy()
      }

      // imitating edge-to-edge mode behavior
      window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING)
    }
  }

  fun enable() {
    eventDispatcher?.addListener(this)
  }

  fun disable() {
    eventDispatcher?.removeListener(this)
  }

  companion object {
    private const val MODAL_SHOW_EVENT = "topShow"
  }
}
