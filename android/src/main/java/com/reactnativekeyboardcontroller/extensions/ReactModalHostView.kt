package com.reactnativekeyboardcontroller.extensions

import com.facebook.react.views.modal.ReactModalHostView
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.log.Logger
import java.lang.reflect.Field

fun ReactModalHostView.hostView(): ReactViewGroup? {
  try {
    val clazz: Class<*> = ReactModalHostView::class.java
    val field: Field = clazz.getDeclaredField("hostView")
    field.isAccessible = true
    val fieldValue = field[this]
    val hostView = fieldValue as? ReactViewGroup

    return hostView
  } catch (e: ClassCastException) {
    Logger.w(javaClass.simpleName, "Can not attach listener because casting failed: ${e.message}")
  } catch (e: NoSuchFieldException) {
    Logger.w(javaClass.simpleName, "Can not attach listener because field `mListeners` not found: ${e.message}")
  }

  return null
}
