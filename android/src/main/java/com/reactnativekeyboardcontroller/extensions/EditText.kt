package com.reactnativekeyboardcontroller.extensions

import android.os.Build
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.widget.EditText
import android.widget.ScrollView
import com.facebook.react.views.textinput.ReactEditText
import com.reactnativekeyboardcontroller.ui.FrameScheduler
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

  val listener = object : TextWatcher {
    @Suppress("detekt:EmptyFunctionBlock")
    override fun afterTextChanged(s: Editable?) {}

    @Suppress("detekt:EmptyFunctionBlock")
    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
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
      Log.w(
        javaClass.simpleName,
        "Can not attach listener because `fieldValue` does not belong to `ArrayList<TextWatcher>`",
      )
    }
  } catch (e: ClassCastException) {
    Log.w(javaClass.simpleName, "Can not attach listener because casting failed: ${e.message}")
  } catch (e: NoSuchFieldException) {
    Log.w(javaClass.simpleName, "Can not attach listener because field `mListeners` not found: ${e.message}")
  }

  return listener
}

val EditText.parentScrollViewTarget: Int
  get() {
    var currentView: View? = this

    while (currentView != null) {
      val parentView = currentView.parent as? View

      if (parentView is ScrollView) {
        // If the parent is a vertical ScrollView, return its id
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

class KeyboardControllerSelectionWatcher(
  private val editText: ReactEditText,
  private val action: (start: Int, end: Int, startX: Double, startY: Double, endX: Double, endY: Double) -> Unit,
) {
  private var lastSelectionStart: Int = -1
  private var lastSelectionEnd: Int = -1

  private val frameScheduler = FrameScheduler {
    val start = editText.selectionStart
    val end = editText.selectionEnd

    if (lastSelectionStart != start || lastSelectionEnd != end) {
      lastSelectionStart = start
      lastSelectionEnd = end

      val view = editText
      val layout = view.layout

      if (layout === null) {
        return@FrameScheduler
      }

      val cursorPositionStartX: Float
      val cursorPositionStartY: Float
      val cursorPositionEndX: Float
      val cursorPositionEndY: Float

      val realStart = min(start, end)
      val realEnd = max(start, end)

      val lineStart = layout.getLineForOffset(realStart)
      val baselineStart = layout.getLineBaseline(lineStart)
      val ascentStart = layout.getLineAscent(lineStart)

      cursorPositionStartX = layout.getPrimaryHorizontal(realStart)
      cursorPositionStartY = (baselineStart + ascentStart).toFloat()

      val lineEnd = layout.getLineForOffset(realEnd)

      val right = layout.getPrimaryHorizontal(realEnd)
      val bottom = layout.getLineBottom(lineEnd) + layout.getLineAscent(lineEnd)
      val cursorWidth = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        view.textCursorDrawable?.intrinsicWidth ?: 0
      } else {
        0
      }

      cursorPositionEndX = right + cursorWidth
      cursorPositionEndY = bottom.toFloat()

      action(start, end, cursorPositionStartX.dp, cursorPositionStartY.dp, cursorPositionEndX.dp, cursorPositionEndY.dp)
    }
  }

  fun setup() {
    frameScheduler.start()
  }

  fun destroy() {
    frameScheduler.stop()
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
