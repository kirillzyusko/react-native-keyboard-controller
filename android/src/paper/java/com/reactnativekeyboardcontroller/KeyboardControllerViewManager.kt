package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.listeners.WindowDimensionListener
import com.reactnativekeyboardcontroller.managers.KeyboardControllerViewManagerImpl
import com.reactnativekeyboardcontroller.views.EdgeToEdgeReactViewGroup

class KeyboardControllerViewManager(
  mReactContext: ReactApplicationContext,
) : ReactViewManager() {
  private val manager = KeyboardControllerViewManagerImpl(mReactContext)
  private var listener: WindowDimensionListener? = null

  // region Lifecycle
  override fun createViewInstance(context: ThemedReactContext): ReactViewGroup {
    if (listener == null) {
      listener = WindowDimensionListener(context)
      listener?.attachListener()
    }
    return manager.createViewInstance(context)
  }

  override fun invalidate() {
    super.invalidate()
    listener?.detachListener()
  }

  override fun onAfterUpdateTransaction(view: ReactViewGroup) {
    super.onAfterUpdateTransaction(view)
    manager.setEdgeToEdge(view as EdgeToEdgeReactViewGroup)
  }

  override fun onDropViewInstance(view: ReactViewGroup) {
    super.onDropViewInstance(view)
    (view as EdgeToEdgeReactViewGroup).setActive(false)
  }
  // endregion

  // region Props setters
  @ReactProp(name = "enabled")
  fun setEnabled(
    view: EdgeToEdgeReactViewGroup,
    enabled: Boolean,
  ) {
    manager.setEnabled(view, enabled)
  }

  @ReactProp(name = "statusBarTranslucent")
  fun setStatusBarTranslucent(
    view: EdgeToEdgeReactViewGroup,
    isStatusBarTranslucent: Boolean,
  ) {
    manager.setStatusBarTranslucent(view, isStatusBarTranslucent)
  }

  @ReactProp(name = "navigationBarTranslucent")
  fun setNavigationBarTranslucent(
    view: EdgeToEdgeReactViewGroup,
    isNavigationBarTranslucent: Boolean,
  ) {
    manager.setNavigationBarTranslucent(view, isNavigationBarTranslucent)
  }

  @ReactProp(name = "preserveEdgeToEdge")
  fun setPreserveEdgeToEdge(
    view: EdgeToEdgeReactViewGroup,
    isPreservingEdgeToEdge: Boolean,
  ) {
    manager.setPreserveEdgeToEdge(view, isPreservingEdgeToEdge)
  }
  // endregion

  // region Constants
  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
    manager.getExportedCustomDirectEventTypeConstants()

  override fun getName(): String = KeyboardControllerViewManagerImpl.NAME
  // endregion
}
