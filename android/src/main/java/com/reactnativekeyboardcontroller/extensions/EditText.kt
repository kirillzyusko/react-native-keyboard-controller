package com.reactnativekeyboardcontroller.extensions

import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.widget.EditText
import com.facebook.react.views.textinput.ReactEditText
import java.lang.reflect.Field

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
