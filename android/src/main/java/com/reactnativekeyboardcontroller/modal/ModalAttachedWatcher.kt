package com.reactnativekeyboardcontroller.modal

import android.os.Build
import android.os.Handler
import android.os.Looper
import android.view.View
import android.view.ViewGroup
import android.view.ViewTreeObserver
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.LinearLayout
import androidx.core.view.ViewCompat
import com.facebook.react.bridge.GuardedRunnable
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.common.UIManagerType
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcherListener
import com.facebook.react.views.modal.ReactModalHostView
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.BuildConfig
import com.reactnativekeyboardcontroller.extensions.content
import com.reactnativekeyboardcontroller.extensions.getDisplaySize
import com.reactnativekeyboardcontroller.extensions.hostView
import com.reactnativekeyboardcontroller.extensions.removeSelf
import com.reactnativekeyboardcontroller.extensions.rootView
import com.reactnativekeyboardcontroller.listeners.KeyboardAnimationCallback
import com.reactnativekeyboardcontroller.listeners.KeyboardAnimationCallbackConfig
import com.reactnativekeyboardcontroller.log.Logger

private val TAG = ModalAttachedWatcher::class.qualifiedName

class ModalAttachedWatcher(
  private val view: ReactViewGroup,
  private val reactContext: ThemedReactContext,
  private val config: () -> KeyboardAnimationCallbackConfig,
  private var callback: () -> KeyboardAnimationCallback?,
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

    val host = modal.hostView()
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

      // Handler(Looper.getMainLooper()).postDelayed({
        println("2222")
      this.callback()?.suspended = true
      val root = if (callback.isKeyboardVisible()) host else rootView
        ViewCompat.setWindowInsetsAnimationCallback(rootView, callback)
        ViewCompat.setOnApplyWindowInsetsListener(root
          , callback)

  // when modal is shown the keyboard will be hidden by default
  callback.syncKeyboardPosition(0.0, false)

        dialog.setOnDismissListener {
          callback.syncKeyboardPosition()
          callback.destroy()
          this.callback()?.suspended = false
        }

        // imitating edge-to-edge mode behavior
        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING)
      // }, 64)

      /*Handler(Looper.getMainLooper()).postDelayed({
        reactContext.runOnNativeModulesQueueThread(
          object : GuardedRunnable(reactContext) {
            override fun runGuarded() {
              val size = reactContext.getDisplaySize()
              val module = reactContext.reactApplicationContext
                .getNativeModule(UIManagerModule::class.java)
              val modalInnerViewId = modal.getChildAt(0)?.id ?: modal.id
              val host = modal.hostView()
              host?.minimumHeight = size.y
              // host?.parent - FrameLayout 1332
              // host?.parent?.parent - FrameLayout android:id/content 1332
              // host?.parent?.parent?.parent - android.widget.LinearLayout 2154
              // host!!.parent.parent.parent.parent <- decor view
              // host!!.parent.parent.parent.parent <- rootView
              println(host?.parent?.parent)
              println((host?.parent?.parent as ViewGroup).height)
              println(size.y)
              println(module)
              println(host?.id)
              println(modal.getChildAt(0)?.parent)
              println(modal.getChildAt(0)?.id)
              println(modal.getChildCount())
              println(modal.id)
              module?.updateNodeSize(modalInnerViewId, size.x, size.y)
              module?.updateNodeSize(modal.id, size.x, size.y)


              UiThreadUtil.runOnUiThread {
                modal.dialog?.window?.setLayout(
                  size.x,
                  size.y
                )
                host?.layoutParams = FrameLayout.LayoutParams(
                  size.x,
                  size.y
                )
                println(host?.parent?.parent)


                // Cast the parent of 'host' to a View to access layoutParams
                val parentView = host?.parent as? ViewGroup

// Cast the grandparent of 'host' to a View to access layoutParams
                val grandParentView = parentView?.parent as? ViewGroup

                // Function to set layout height to MATCH_PARENT
                fun setHeightToMatchParent(view: ViewGroup?) {
                  view?.let {
                    val layoutParams = it.layoutParams
                    layoutParams.height = ViewGroup.LayoutParams.MATCH_PARENT
                    it.layoutParams = layoutParams
                    it.requestLayout() // Request a layout pass after changing layout params
                  }
                }

// Set the height of parentView to MATCH_PARENT
                setHeightToMatchParent(parentView)

// Set the height of grandParentView to MATCH_PARENT
                setHeightToMatchParent(grandParentView)

                println(host?.parent)
                println(host?.parent?.parent)
                println(host?.parent?.parent?.parent)
              }

            }
          })
      }, 2000)*/
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
