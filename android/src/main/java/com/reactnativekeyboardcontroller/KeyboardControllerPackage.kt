package com.reactnativekeyboardcontroller

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.facebook.soloader.SoLoader

class KeyboardControllerPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(KeyboardControllerModule(reactContext), StatusBarManagerCompatModule(reactContext))
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      SoLoader.loadLibrary("reactnativekeyboardcontroller_modules")
    }

    return listOf(KeyboardControllerViewManager(reactContext))
  }
}
