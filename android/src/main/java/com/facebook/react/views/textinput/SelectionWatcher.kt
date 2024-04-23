// re-declaration of SelectionWatcher from react-native, but with public visibility

package com.facebook.react.views.textinput

interface SelectionWatcher {
  fun onSelectionChanged(start: Int, end: Int)
}
