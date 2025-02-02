package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.managers.KeyboardControllerViewManagerImpl
import com.reactnativekeyboardcontroller.views.EdgeToEdgeReactViewGroup

class KeyboardControllerViewManager(
  mReactContext: ReactApplicationContext,
) : ReactViewManager() {
  private val manager = KeyboardControllerViewManagerImpl(mReactContext)

  override fun getName(): String = KeyboardControllerViewManagerImpl.NAME

  override fun createViewInstance(reactContext: ThemedReactContext): EdgeToEdgeReactViewGroup =
    manager.createViewInstance(reactContext)

  override fun updateProperties(
    viewToUpdate: ReactViewGroup,
    props: ReactStylesDiffMap?,
  ) {
    super.updateProperties(viewToUpdate, props)
    manager.updateProperties(viewToUpdate as EdgeToEdgeReactViewGroup, props)
  }

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

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
    manager.getExportedCustomDirectEventTypeConstants()
}
