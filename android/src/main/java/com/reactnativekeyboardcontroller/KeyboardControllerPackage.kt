package com.reactnativekeyboardcontroller

import androidx.annotation.Nullable
import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class KeyboardControllerPackage : TurboReactPackage() {
  @Nullable
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return when (name) {
      KeyboardControllerModuleImpl.NAME -> {
        KeyboardControllerModule(reactContext)
      }
      StatusBarManagerCompatImpl.NAME -> {
        StatusBarManagerCompatModule(reactContext)
      }
      else -> {
        null
      }
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      val isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED

      moduleInfos[KeyboardControllerModuleImpl.NAME] = ReactModuleInfo(
        KeyboardControllerModuleImpl.NAME,
        KeyboardControllerModuleImpl.NAME,
        false, // canOverrideExistingModule
        false, // needsEagerInit
        true, // hasConstants
        false, // isCxxModule
        isTurboModule // isTurboModule
      )
      moduleInfos[StatusBarManagerCompatImpl.NAME] = ReactModuleInfo(
        StatusBarManagerCompatImpl.NAME,
        StatusBarManagerCompatImpl.NAME,
        false, // canOverrideExistingModule
        false, // needsEagerInit
        true, // hasConstants
        false, // isCxxModule
        isTurboModule // isTurboModule
      )
      moduleInfos
    }
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf(KeyboardControllerViewManager(reactContext))
  }
}
