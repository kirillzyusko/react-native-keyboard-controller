@file:Suppress("detekt:TooGenericExceptionCaught")

package com.reactnativekeyboardcontroller.modules.statusbar

import com.facebook.react.bridge.ReactApplicationContext
import com.reactnativekeyboardcontroller.log.Logger
import java.lang.reflect.Method

private val TAG = StatusBarModuleProxy::class.qualifiedName

/**
 * For the sake of better compatibility with the old/new version of the react-native, we are using reflection
 * to call the methods of the module. In RN 0.78 the `StatusBarModule` was public, but in RN 0.80
 * it's internal (kotlin-only). So we are using reflection to call the methods of the module.
 */
class StatusBarModuleProxy(
  reactContext: ReactApplicationContext,
) {
  private var instance: Any? = null

  private var setHiddenMethod: Method? = null
  private var setColorMethod: Method? = null
  private var setTranslucentMethod: Method? = null
  private var setStyleMethod: Method? = null
  private var getConstantsMethod: Method? = null

  init {
    try {
      val clazz = Class.forName("com.facebook.react.modules.statusbar.StatusBarModule")
      val constructor = clazz.getConstructor(ReactApplicationContext::class.java)
      instance = constructor.newInstance(reactContext)

      setHiddenMethod = clazz.getMethod("setHidden", Boolean::class.java)
      setColorMethod = clazz.getMethod("setColor", Double::class.java, Boolean::class.java)
      setTranslucentMethod = clazz.getMethod("setTranslucent", Boolean::class.java)
      setStyleMethod = clazz.getMethod("setStyle", String::class.java)
      getConstantsMethod = clazz.getMethod("getConstants")
    } catch (e: Exception) {
      Logger.w(TAG, "Failed to initialize StatusBarModule via reflection", e)
    }
  }

  fun setHidden(hidden: Boolean) {
    try {
      setHiddenMethod?.invoke(instance, hidden)
    } catch (e: Exception) {
      Logger.w(TAG, "Error invoking StatusBarModule.setHidden method", e)
    }
  }

  fun setColor(
    color: Double,
    animated: Boolean,
  ) {
    try {
      setColorMethod?.invoke(instance, color, animated)
    } catch (e: Exception) {
      Logger.w(TAG, "Error invoking StatusBarModule.setColor method", e)
    }
  }

  fun setTranslucent(translucent: Boolean) {
    try {
      setTranslucentMethod?.invoke(instance, translucent)
    } catch (e: Exception) {
      Logger.w(TAG, "Error invoking StatusBarModule.setTranslucent method", e)
    }
  }

  fun setStyle(style: String) {
    try {
      setStyleMethod?.invoke(instance, style)
    } catch (e: Exception) {
      Logger.w(TAG, "Error invoking StatusBarModule.setStyle method", e)
    }
  }

  fun getConstants(): MutableMap<String, Any>? =
    try {
      @Suppress("UNCHECKED_CAST")
      getConstantsMethod?.invoke(instance) as? MutableMap<String, Any>
    } catch (e: Exception) {
      Logger.w(TAG, "Error invoking StatusBarModule.getConstants method", e)
      null
    }
}
