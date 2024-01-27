package com.reactnativekeyboardcontroller.traversal

import com.facebook.react.views.textinput.ReactEditText
import java.lang.ref.WeakReference

object FocusedInputHolder {
  private var input: WeakReference<ReactEditText?>? = null

  fun set(textInput: ReactEditText) {
    input = WeakReference(textInput)
  }

  fun requestFocus() {
    input?.get()?.requestFocusFromJS()
  }
}
