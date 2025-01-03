package com.reactnativekeyboardcontroller.extensions

import android.os.Build
import android.text.Editable
import android.text.InputType
import android.text.TextWatcher
import android.view.Gravity
import android.view.View
import android.view.ViewTreeObserver.OnPreDrawListener
import android.widget.EditText
import com.facebook.react.views.scroll.ReactScrollView
import com.facebook.react.views.textinput.ReactEditText
import com.reactnativekeyboardcontroller.log.Logger
import java.lang.reflect.Field
import kotlin.math.max
import kotlin.math.min

/**
 * Adds a listener that will be fired only once for each unique value.
 *
 * This is needed because `onTextChanged` can be fired two and more times with the same value.
 * And in this helper we filter out all subsequent calls with the same value.
 */
fun EditText.addOnTextChangedListener(action: (String) -> Unit): TextWatcher {
  var lastText: String? = null

  val listener =
    object : TextWatcher {
      @Suppress("detekt:EmptyFunctionBlock")
      override fun afterTextChanged(s: Editable?) = Unit

      @Suppress("detekt:EmptyFunctionBlock")
      override fun beforeTextChanged(
        s: CharSequence?,
        start: Int,
        count: Int,
        after: Int,
      ) = Unit

      override fun onTextChanged(
        s: CharSequence?,
        start: Int,
        before: Int,
        count: Int,
      ) {
        val currentText = s.toString()

        if (currentText != lastText) {
          lastText = currentText
          action(currentText)
        }
      }
    }

  // we can not simply call `addTextChangedListener(listener)`, because the issue
  // https://github.com/kirillzyusko/react-native-keyboard-controller/issues/324
  // will be reproducible again.
  //
  // so here we push our listener to first position to avoid the soft crash
  try {
    val clazz: Class<*> = ReactEditText::class.java
    val field: Field = clazz.getDeclaredField("mListeners")
    field.isAccessible = true
    val fieldValue = field[this]
    val listeners = fieldValue as? ArrayList<*>

    if (listeners != null && listeners.all { it is TextWatcher }) {
      // fieldValue is an ArrayList<TextWatch>
      val textWatchListeners = listeners as ArrayList<TextWatcher>

      textWatchListeners.add(0, listener)
    } else {
      Logger.w(
        javaClass.simpleName,
        "Can not attach listener because `fieldValue` does not belong to `ArrayList<TextWatcher>`",
      )
    }
  } catch (e: ClassCastException) {
    Logger.w(javaClass.simpleName, "Can not attach listener because casting failed: ${e.message}")
  } catch (e: NoSuchFieldException) {
    Logger.w(javaClass.simpleName, "Can not attach listener because field `mListeners` not found: ${e.message}")
  }

  return listener
}

val EditText.parentScrollViewTarget: Int
  get() {
    var currentView: View? = this

    while (currentView != null) {
      val parentView = currentView.parent as? View

      if (parentView is ReactScrollView && parentView.scrollEnabled) {
        // If the parent is a vertical, scrollable ScrollView - return its id
        return parentView.id
      }

      // Move to the next parent view
      currentView = parentView
    }

    // ScrollView was not found
    return -1
  }

fun EditText?.focus() {
  if (this is ReactEditText) {
    this.requestFocusFromJS()
  } else {
    this?.requestFocus()
  }
}

val EditText?.keyboardType: String
  get() {
    if (this == null) {
      return "default"
    }

    // Extract base input type class
    val inputTypeClass = inputType and InputType.TYPE_MASK_CLASS
    val inputTypeVariation = inputType and InputType.TYPE_MASK_VARIATION

    // Check for special input types
    return when {
      inputTypeVariation == InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS -> "email-address"
      inputTypeVariation == InputType.TYPE_TEXT_VARIATION_URI -> "url"
      inputTypeVariation == InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD -> "visible-password"

      // Check for specific input type classes
      inputTypeClass == InputType.TYPE_CLASS_NUMBER ->
        when {
          (inputType and InputType.TYPE_NUMBER_FLAG_DECIMAL) != 0 &&
            (inputType and InputType.TYPE_NUMBER_FLAG_SIGNED) == 0 -> "decimal-pad"

          (inputType and InputType.TYPE_NUMBER_FLAG_SIGNED) != 0 -> "numeric"

          else -> "number-pad"
        }

      inputTypeClass == InputType.TYPE_CLASS_PHONE -> "phone-pad"
      inputTypeClass == InputType.TYPE_CLASS_TEXT -> "default"

      else -> "default"
    }
  }

class KeyboardControllerSelectionWatcher(
  private val editText: ReactEditText,
  private val action: (start: Int, end: Int, startX: Double, startY: Double, endX: Double, endY: Double) -> Unit,
) {
  private var lastSelectionStart: Int = -1
  private var lastSelectionEnd: Int = -1
  private var lastEditTextHeight: Int = -1

  private val preDrawListener: OnPreDrawListener =
    object : OnPreDrawListener {
      override fun onPreDraw(): Boolean {
        val start = editText.selectionStart
        val end = editText.selectionEnd
        val editTextHeight = editText.height

        val view = editText
        val layout = view.layout

        if (layout === null) {
          return true
        }

        if (lastSelectionStart != start || lastSelectionEnd != end || lastEditTextHeight != editTextHeight) {
          lastSelectionStart = start
          lastSelectionEnd = end
          lastEditTextHeight = editTextHeight

          val cursorPositionStartX: Float
          val cursorPositionStartY: Float
          val cursorPositionEndX: Float
          val cursorPositionEndY: Float

          val realStart = min(start, end)
          val realEnd = max(start, end)

          val lineStart = layout.getLineForOffset(realStart)
          val baselineStart = layout.getLineTop(lineStart)

          val textHeight = layout.height
          val cursorWidth =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
              view.textCursorDrawable?.intrinsicWidth ?: 0
            } else {
              0
            }
          val gravity = editText.gravity and Gravity.VERTICAL_GRAVITY_MASK
          val verticalOffset =
            when (gravity) {
              Gravity.CENTER_VERTICAL -> (editTextHeight - textHeight) / 2 + editText.paddingTop
              Gravity.BOTTOM -> editTextHeight - textHeight
              // Default to Gravity.TOP or other cases
              else -> editText.paddingTop * 2
            }

          cursorPositionStartX = layout.getPrimaryHorizontal(realStart)
          cursorPositionStartY = (baselineStart + verticalOffset).toFloat()

          val lineEnd = layout.getLineForOffset(realEnd)
          val right = layout.getPrimaryHorizontal(realEnd)
          val bottom = layout.getLineBottom(lineEnd)

          cursorPositionEndX = right + cursorWidth
          cursorPositionEndY = (bottom + verticalOffset).toFloat()

          action(
            start,
            end,
            cursorPositionStartX.dp,
            cursorPositionStartY.dp,
            cursorPositionEndX.dp,
            cursorPositionEndY.dp,
          )
        }

        return true
      }
    }

  fun setup() {
    editText.viewTreeObserver.addOnPreDrawListener(preDrawListener)
  }

  fun destroy() {
    editText.viewTreeObserver.removeOnPreDrawListener(preDrawListener)
  }
}

fun ReactEditText.addOnSelectionChangedListener(
  action: (start: Int, end: Int, startX: Double, startY: Double, endX: Double, endY: Double) -> Unit,
): () -> Unit {
  val listener = KeyboardControllerSelectionWatcher(this, action)

  listener.setup()

  return {
    listener.destroy()
  }
}
