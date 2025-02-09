package com.reactnativekeyboardcontroller

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
import com.reactnativekeyboardcontroller.modules.KeyboardControllerModuleImpl
import com.reactnativekeyboardcontroller.modules.StatusBarManagerCompatModuleImpl

class KeyboardControllerPackage : BaseReactPackage() {
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
          false, // canOverrideExistingModule
          false, // needsEagerInit
          false, // isCxxModule
          isTurboModule, // isTurboModule
        )
      moduleInfos
    }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =
    listOf(
      KeyboardControllerViewManager(reactContext),
      KeyboardGestureAreaViewManager(reactContext),
      OverKeyboardViewManager(reactContext),
    )
}
