package com.reactnativekeyboardcontroller

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.KeyboardControllerViewManagerDelegate
import com.facebook.react.viewmanagers.KeyboardControllerViewManagerInterface
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.managers.KeyboardControllerViewManagerImpl
import com.reactnativekeyboardcontroller.views.EdgeToEdgeReactViewGroup

class KeyboardControllerViewManager :
  ReactViewManager(),
  KeyboardControllerViewManagerInterface<ReactViewGroup> {
  private val manager = KeyboardControllerViewManagerImpl()
  private val mDelegate = KeyboardControllerViewManagerDelegate(this)

  // region Lifecycle
  override fun createViewInstance(context: ThemedReactContext): ReactViewGroup = manager.createViewInstance(context)

  override fun invalidate() {
    super.invalidate()
    manager.invalidate()
  }

  override fun onAfterUpdateTransaction(view: ReactViewGroup) {
    super.onAfterUpdateTransaction(view)
    manager.setEdgeToEdge(view as EdgeToEdgeReactViewGroup)
  }
  // endregion

  // region Props setters
  @ReactProp(name = "statusBarTranslucent")
  override fun setStatusBarTranslucent(
    view: ReactViewGroup,
    value: Boolean,
  ) = manager.setStatusBarTranslucent(view as EdgeToEdgeReactViewGroup, value)

  @ReactProp(name = "navigationBarTranslucent")
  override fun setNavigationBarTranslucent(
    view: ReactViewGroup,
    value: Boolean,
  ) = manager.setNavigationBarTranslucent(view as EdgeToEdgeReactViewGroup, value)

  @ReactProp(name = "preserveEdgeToEdge")
  override fun setPreserveEdgeToEdge(
    view: ReactViewGroup,
    value: Boolean,
  ) = manager.setPreserveEdgeToEdge(view as EdgeToEdgeReactViewGroup, value)

  @ReactProp(name = "enabled")
  override fun setEnabled(
    view: ReactViewGroup,
    value: Boolean,
  ) = manager.setEnabled(view as EdgeToEdgeReactViewGroup, value)
  // endregion

  // region Getters
  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
    manager.getExportedCustomDirectEventTypeConstants()

  override fun getDelegate(): ViewManagerDelegate<ReactViewGroup> = mDelegate

  override fun getName(): String = KeyboardControllerViewManagerImpl.NAME
  // endregion
}
