package com.reactnativekeyboardcontroller.traversal

import android.widget.EditText
import com.reactnativekeyboardcontroller.extensions.requireFocus
import java.lang.ref.WeakReference

object FocusedInputHolder {
  private var input: WeakReference<EditText?>? = null

  fun set(textInput: EditText) {
    input = WeakReference(textInput)
  }

  fun requestFocus() {
    input?.get()?.requireFocus()
  }

  fun get(): EditText? {
    return input?.get()
  }
}
