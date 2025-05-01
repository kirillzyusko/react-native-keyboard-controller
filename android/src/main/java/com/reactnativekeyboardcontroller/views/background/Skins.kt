package com.reactnativekeyboardcontroller.views.background

import android.graphics.Color
import androidx.annotation.ColorInt
import androidx.core.content.ContextCompat
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.R
import com.reactnativekeyboardcontroller.extensions.currentImePackage
import com.reactnativekeyboardcontroller.extensions.isSystemDarkMode

val imeColorMap: Map<String, Pair<Int, Int>> = mapOf(
  "com.google.android.inputmethod.latin" to (R.color.gboard_light to R.color.gboard_dark),
  "com.touchtype.swiftkey" to (R.color.swiftkey_light to R.color.swiftkey_dark),
  "com.google.android.tts" to (R.color.gboard_light to R.color.gboard_dark),
  "ru.yandex.androidkeyboard" to (R.color.yandex_light to R.color.yandex_dark)
)

object Skins {
  @ColorInt
  fun ThemedReactContext.getInputMethodColor(): Int {
    val imePackage = currentImePackage()
    val isDark = isSystemDarkMode()

    val (lightColorRes, darkColorRes) = imeColorMap[imePackage]
      ?: (R.color.gboard_dark to R.color.gboard_dark)

    val resId = if (isDark) darkColorRes else lightColorRes
    return ContextCompat.getColor(this, resId)
  }

  @ColorInt
  private fun getDefaultColor(): Int = Color.parseColor("#FFCCCCCC")
}
