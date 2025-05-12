package com.reactnativekeyboardcontroller.views.background

import android.graphics.Color
import android.os.Build
import android.util.Log
import androidx.annotation.ColorInt
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.toArgb
import androidx.core.content.ContextCompat
import androidx.core.graphics.ColorUtils
import com.facebook.react.uimanager.PixelUtil.dpToPx
import com.facebook.react.uimanager.PixelUtil.pxToDp
import com.facebook.react.uimanager.ThemedReactContext
import com.google.android.material.elevation.ElevationOverlayProvider
import com.reactnativekeyboardcontroller.R
import com.google.android.material.R as MaterialR
import com.reactnativekeyboardcontroller.extensions.currentImePackage
import com.reactnativekeyboardcontroller.extensions.isSystemDarkMode

object ImePackages {
  const val GBOARD = "com.google.android.inputmethod.latin"
  const val SWIFT_KEY = "com.touchtype.swiftkey"
  const val GBOARD_TTS = "com.google.android.googlequicksearchbox"
  const val GOOGLE_TTS = "com.google.android.tts"
  const val YANDEX = "ru.yandex.androidkeyboard"
  const val SAMSUNG = "com.samsung.android.honeyboard"
}

val imeColorMap: Map<String, Pair<Int, Int>> = mapOf(
  ImePackages.GBOARD to (R.color.gboard_light to R.color.gboard_dark),
  ImePackages.SWIFT_KEY to (R.color.swiftkey_light to R.color.swiftkey_dark),
  ImePackages.GBOARD_TTS to (R.color.gboard_tts_light to R.color.gboard_tts_dark),
  ImePackages.GOOGLE_TTS to (R.color.gboard_tts_light to R.color.gboard_tts_dark),
  ImePackages.YANDEX to (R.color.yandex_light to R.color.yandex_dark),
  ImePackages.SAMSUNG to (R.color.samsung_light to R.color.samsung_dark)
)

fun shiftColor(@ColorInt color: Int, shiftPercentage: Float): Int {
  val hsl = FloatArray(3)
  ColorUtils.colorToHSL(color, hsl) // hsl[0]=Hue, hsl[1]=Saturation, hsl[2]=Lightness

  // Shift lightness (e.g., reduce lightness by 5% for a "darker" 850)
  hsl[2] = (hsl[2] * (1 + shiftPercentage)).coerceIn(0f, 1f)

  return ColorUtils.HSLToColor(hsl)
}

@ColorInt
fun shiftRgbChannels(@ColorInt color: Int, shift: Int = 4): Int {
  // Extract RGB channels and shift each by `shift`
  val red = (Color.red(color) + shift).coerceIn(0, 255)
  val green = (Color.green(color) + shift).coerceIn(0, 255)
  val blue = (Color.blue(color) + shift).coerceIn(0, 255)

  // Preserve alpha and combine shifted channels
  return Color.argb(
    Color.alpha(color), // Keep original alpha
    red,
    green,
    blue
  )
}

// TODO: re-work as extension?
object Skins {
  @ColorInt
  fun ThemedReactContext.getInputMethodColor(): Int {
    val imePackage = currentImePackage()
    val isDark = isSystemDarkMode()

    println("Current IME: $imePackage")
    println(imePackage)
    Log.i("Skins", "Current IME: $imePackage")

    val colorScheme = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      dynamicLightColorScheme(this)
    } else {
      lightColorScheme() // fallback
    }

    getColor(MaterialR.color.m3_ref_palette_dynamic_primary10).let {}

    val colors = listOf(
      "primary" to colorScheme.primary,
      "onPrimary" to colorScheme.onPrimary,
      "primaryContainer" to colorScheme.primaryContainer,
      "onPrimaryContainer" to colorScheme.onPrimaryContainer,
      "inversePrimary" to colorScheme.inversePrimary,
      "secondary" to colorScheme.secondary,
      "onSecondary" to colorScheme.onSecondary,
      "secondaryContainer" to colorScheme.secondaryContainer,
      "onSecondaryContainer" to colorScheme.onSecondaryContainer,
      "tertiary" to colorScheme.tertiary,
      "onTertiary" to colorScheme.onTertiary,
      "tertiaryContainer" to colorScheme.tertiaryContainer,
      "onTertiaryContainer" to colorScheme.onTertiaryContainer,
      "background" to colorScheme.background,
      "onBackground" to colorScheme.onBackground,
      "surface" to colorScheme.surface,
      "onSurface" to colorScheme.onSurface,
      "surfaceVariant" to colorScheme.surfaceVariant,
      "onSurfaceVariant" to colorScheme.onSurfaceVariant,
      "surfaceTint" to colorScheme.surfaceTint,
      "inverseSurface" to colorScheme.inverseSurface,
      "inverseOnSurface" to colorScheme.inverseOnSurface,
      "error" to colorScheme.error,
      "onError" to colorScheme.onError,
      "errorContainer" to colorScheme.errorContainer,
      "onErrorContainer" to colorScheme.onErrorContainer,
      "outline" to colorScheme.outline,
      "outlineVariant" to colorScheme.outlineVariant,
      "scrim" to colorScheme.scrim,
      "surfaceBright" to colorScheme.surfaceBright,
      "surfaceDim" to colorScheme.surfaceDim,
      "surfaceContainer" to colorScheme.surfaceContainer,
      "surfaceContainerHigh" to colorScheme.surfaceContainerHigh,
      "surfaceContainerHighest" to colorScheme.surfaceContainerHighest,
      "surfaceContainerLow" to colorScheme.surfaceContainerLow,
      "surfaceContainerLowest" to colorScheme.surfaceContainerLowest,
    )

    colors.forEach { (name, color) ->
      val hex = "#%02X%02X%02X".format(
        (color.red * 255).toInt(),
        (color.green * 255).toInt(),
        (color.blue * 255).toInt()
      )
      Log.d("ColorScheme", "$name = $hex")
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && imePackage == ImePackages.GBOARD) {
      if (isDark) {
        return shiftRgbChannels((colorScheme.onBackground.toArgb()), 4)
      }
      return colorScheme.surfaceContainer.toArgb()
    }

    val (lightColorRes, darkColorRes) = imeColorMap[imePackage]
      ?: (R.color.gboard_dark to R.color.gboard_dark)

    // on Android 10 dark theme doesn't affect keyboard color
    val resId = if (isDark && Build.VERSION.SDK_INT > Build.VERSION_CODES.Q) darkColorRes else lightColorRes
    return ContextCompat.getColor(this, resId)
  }
}
