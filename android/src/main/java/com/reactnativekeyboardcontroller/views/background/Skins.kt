package com.reactnativekeyboardcontroller.views.background

import android.content.Context
import android.graphics.Color
import android.os.Build
import androidx.annotation.ColorInt
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.R
import com.reactnativekeyboardcontroller.extensions.currentImePackage
import com.reactnativekeyboardcontroller.extensions.isSystemDarkMode
import com.reactnativekeyboardcontroller.log.Logger

private const val TAG = "Skins"
private const val MAX_RGB_VALUE = 255

object ImePackages {
  const val AOSP = "com.android.inputmethod.latin"
  const val GBOARD = "com.google.android.inputmethod.latin"
  const val SWIFT_KEY = "com.touchtype.swiftkey"
  const val GBOARD_TTS = "com.google.android.googlequicksearchbox"
  const val GOOGLE_TTS = "com.google.android.tts"
  const val YANDEX = "ru.yandex.androidkeyboard"
  const val SAMSUNG = "com.samsung.android.honeyboard"
}

val imeColorMap: Map<String, Pair<Int, Int>> =
  mapOf(
    ImePackages.AOSP to (R.style.aosp_light to R.style.aosp_light),
    ImePackages.GBOARD to (R.style.gboard_light to R.style.gboard_dark),
    ImePackages.SWIFT_KEY to (R.style.swiftkey_light to R.style.swiftkey_dark),
    ImePackages.GBOARD_TTS to (R.style.gboard_tts_light to R.style.gboard_tts_dark),
    ImePackages.GOOGLE_TTS to (R.style.gboard_tts_light to R.style.gboard_tts_dark),
    ImePackages.YANDEX to (R.style.yandex_light to R.style.yandex_dark),
    ImePackages.SAMSUNG to (R.style.samsung_light to R.style.samsung_dark),
  )

data class ColorProperties(
  @ColorInt val color: Int,
  val tone: Int = 0,
) {
  @get:ColorInt
  val blend: Int
    get() = shiftRgbChannels(color, tone)
}

fun Context.getColorProperties(styleResId: Int): ColorProperties {
  val attrs = obtainStyledAttributes(styleResId, R.styleable.ColorProperties)
  try {
    return ColorProperties(
      color = attrs.getColor(R.styleable.ColorProperties_color, Color.BLACK),
      tone = attrs.getInt(R.styleable.ColorProperties_tone, 0),
    )
  } finally {
    attrs.recycle()
  }
}

@ColorInt
fun shiftRgbChannels(
  @ColorInt color: Int,
  shift: Int = 4,
): Int {
  val red = (Color.red(color) + shift).coerceIn(0, MAX_RGB_VALUE)
  val green = (Color.green(color) + shift).coerceIn(0, MAX_RGB_VALUE)
  val blue = (Color.blue(color) + shift).coerceIn(0, MAX_RGB_VALUE)

  return Color.argb(
    Color.alpha(color),
    red,
    green,
    blue,
  )
}

@ColorInt
fun ThemedReactContext.getInputMethodColor(): Int {
  val imePackage = currentImePackage()
  val isDark = isSystemDarkMode()

  Logger.i(TAG, "Current IME: $imePackage")

  val (lightColorRes, darkColorRes) =
    imeColorMap[imePackage]
      ?: (R.style.gboard_light to R.style.gboard_dark)

  // on Android 10 dark theme doesn't affect keyboard color
  val resId = if (isDark && Build.VERSION.SDK_INT > Build.VERSION_CODES.Q) darkColorRes else lightColorRes
  val color = getColorProperties(resId).blend

  return color
}
