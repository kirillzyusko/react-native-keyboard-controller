package com.reactnativekeyboardcontroller.modal

import android.view.Window
import java.lang.ref.WeakReference

/**
 * Keeps track of the windows of the `Modal`s that are currently shown, so that status bar changes
 * can be applied to the window the user actually sees.
 */
object ActiveWindowHolder {
  private val windows = ArrayList<WeakReference<Window>>()

  @Synchronized
  fun add(window: Window) {
    windows.add(WeakReference(window))
  }

  @Synchronized
  fun remove(window: Window) {
    windows.removeAll { it.get() == null || it.get() === window }
  }

  /**
   * @return the window of the top-most shown `Modal` or `null` if no `Modal` is shown.
   */
  @Synchronized
  fun get(): Window? {
    windows.removeAll { it.get() == null }
    return windows.lastOrNull()?.get()
  }
}
