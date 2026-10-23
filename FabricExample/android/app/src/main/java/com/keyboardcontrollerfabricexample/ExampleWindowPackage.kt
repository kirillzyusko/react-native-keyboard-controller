package com.keyboardcontrollerfabricexample

import android.graphics.Color
import androidx.core.view.WindowCompat
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.ViewManager

/** Window styling removed from recent react-native-screens Android releases. */
class ExampleWindowPackage : ReactPackage {
  override fun createNativeModules(context: ReactApplicationContext): List<NativeModule> =
    listOf(ExampleWindowModule(context))

  override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}

private class ExampleWindowModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  override fun getName() = "ExampleWindow"

  @ReactMethod
  fun setNavigationBar(color: String, darkIcons: Boolean) {
    val activity = reactApplicationContext.currentActivity ?: return
    activity.runOnUiThread {
      val window = activity.window
      @Suppress("DEPRECATION")
      window.navigationBarColor = Color.parseColor(color)
      WindowCompat.getInsetsController(window, window.decorView).isAppearanceLightNavigationBars = darkIcons
    }
  }
}
