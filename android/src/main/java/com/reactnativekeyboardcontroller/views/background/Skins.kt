package com.reactnativekeyboardcontroller.views.background

import android.os.Build
import android.util.Log
import androidx.annotation.ColorInt
import androidx.core.content.ContextCompat
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.R
import com.reactnativekeyboardcontroller.extensions.currentImePackage
import com.reactnativekeyboardcontroller.extensions.isSystemDarkMode

val imeColorMap: Map<String, Pair<Int, Int>> = mapOf(
  "com.google.android.inputmethod.latin" to (R.color.gboard_light to R.color.gboard_dark),
  "com.touchtype.swiftkey" to (R.color.swiftkey_light to R.color.swiftkey_dark),
  "com.google.android.googlequicksearchbox" to (R.color.gboard_tts_light to R.color.gboard_tts_dark),
  "com.google.android.tts" to (R.color.gboard_tts_light to R.color.gboard_tts_dark),
  "ru.yandex.androidkeyboard" to (R.color.yandex_light to R.color.yandex_dark),
  "com.samsung.android.honeyboard" to (R.color.samsung_light to R.color.samsung_dark)
)

// TODO: re-work as extension?
object Skins {
  @ColorInt
  fun ThemedReactContext.getInputMethodColor(): Int {
    val imePackage = currentImePackage()
    val isDark = isSystemDarkMode()

    println("Current IME: $imePackage")
    println(imePackage)
    Log.i("Skins", "Current IME: $imePackage")

    val (lightColorRes, darkColorRes) = imeColorMap[imePackage]
      ?: (R.color.gboard_dark to R.color.gboard_dark)

    // on Android 10 dark theme doesn't affect keyboard color
    val resId = if (isDark && Build.VERSION.SDK_INT > Build.VERSION_CODES.Q) darkColorRes else lightColorRes
    return ContextCompat.getColor(this, resId)
  }
}
