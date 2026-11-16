package com.reactnativekeyboardcontroller

import com.facebook.react.BaseReactPackage
import com.facebook.react.ViewManagerOnDemandReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
import com.reactnativekeyboardcontroller.managers.ClippingScrollViewDecoratorViewManagerImpl
import com.reactnativekeyboardcontroller.managers.KeyboardBackgroundViewManagerImpl
import com.reactnativekeyboardcontroller.managers.KeyboardControllerViewManagerImpl
import com.reactnativekeyboardcontroller.managers.KeyboardGestureAreaViewManagerImpl
import com.reactnativekeyboardcontroller.managers.KeyboardToolbarGroupViewManagerImpl
import com.reactnativekeyboardcontroller.managers.OverKeyboardViewManagerImpl
import com.reactnativekeyboardcontroller.modules.KeyboardControllerModuleImpl
import com.reactnativekeyboardcontroller.modules.statusbar.StatusBarManagerCompatModuleImpl

class KeyboardControllerPackage :
  BaseReactPackage(),
  ViewManagerOnDemandReactPackage {
  override fun getModule(
    name: String,
    reactContext: ReactApplicationContext,
  ): NativeModule? =
    when (name) {
      KeyboardControllerModuleImpl.NAME -> {
        KeyboardControllerModule(reactContext)
      }
      StatusBarManagerCompatModuleImpl.NAME -> {
        StatusBarManagerCompatModule(reactContext)
      }
      else -> {
        null
      }
    }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
    ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      val isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED

      moduleInfos[KeyboardControllerModuleImpl.NAME] =
        ReactModuleInfo(
          KeyboardControllerModuleImpl.NAME,
          KeyboardControllerModuleImpl.NAME,
          false, // canOverrideExistingModule
          false, // needsEagerInit
          false, // isCxxModule
          isTurboModule, // isTurboModule
        )
      moduleInfos[StatusBarManagerCompatModuleImpl.NAME] =
        ReactModuleInfo(
          StatusBarManagerCompatModuleImpl.NAME,
          StatusBarManagerCompatModuleImpl.NAME,
          true, // canOverrideExistingModule
          false, // needsEagerInit
          false, // isCxxModule
          isTurboModule, // isTurboModule
        )
      moduleInfos
    }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =
    viewManagers.values.map { create -> create() }

  // React Native builds the config (props and events) of an on-demand view manager when JS first uses
  // that view, instead of building the configs of all of them at startup.
  override fun getViewManagerNames(reactContext: ReactApplicationContext): Collection<String> = viewManagers.keys

  override fun createViewManager(
    reactContext: ReactApplicationContext,
    viewManagerName: String,
  ): ViewManager<*, *>? = viewManagers[viewManagerName]?.invoke()

  private companion object {
    val viewManagers: Map<String, () -> ViewManager<*, *>> =
      linkedMapOf(
        KeyboardControllerViewManagerImpl.NAME to ::KeyboardControllerViewManager,
        KeyboardGestureAreaViewManagerImpl.NAME to ::KeyboardGestureAreaViewManager,
        OverKeyboardViewManagerImpl.NAME to ::OverKeyboardViewManager,
        KeyboardBackgroundViewManagerImpl.NAME to ::KeyboardBackgroundViewManager,
        ClippingScrollViewDecoratorViewManagerImpl.NAME to ::ClippingScrollViewDecoratorViewManager,
        KeyboardToolbarGroupViewManagerImpl.NAME to ::KeyboardToolbarGroupViewManager,
      )
  }
}
