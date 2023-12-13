package com.reactnativekeyboardcontroller.extensions

import android.text.Editable
import android.text.TextWatcher
import android.widget.EditText

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

  addTextChangedListener(listener)

  return listener
}
