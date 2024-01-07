package com.reactnativekeyboardcontroller.traversal

import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.views.textinput.ReactEditText
import java.lang.ClassCastException

object ViewHierarchyNavigator {
  fun setFocusTo(direction: String, view: View) {
    val input = if (direction == "next") findNextEditText(view) else findPreviousEditText(view)

    UiThreadUtil.runOnUiThread {
      (input as ReactEditText?)?.requestFocusFromJS()
    }
  }

  private fun findNextEditText(currentFocus: View): EditText? {
    return findEditTextInDirection(currentFocus, 1)
  }

  private fun findPreviousEditText(currentFocus: View): EditText? {
    return findEditTextInDirection(currentFocus, -1)
  }

  private fun findEditTextInDirection(currentFocus: View, direction: Int): EditText? {
    try {
      // Find the parent view group
      val parentViewGroup = currentFocus.parent as ViewGroup?

      if (parentViewGroup != null) {
        // Find the index of the current EditText in its parent
        val currentIndex = parentViewGroup.indexOfChild(currentFocus)

        // Check for the sibling in the specified direction in the parent
        var i = if (direction > 0) currentIndex + 1 else currentIndex - 1
        val end = if (direction > 0) parentViewGroup.childCount else -1

        while (i != end) {
          val nextChild = parentViewGroup.getChildAt(i)

          val editText = findEditTextOrGoDeeper(nextChild)

          if (editText != null) {
            return editText
          }

          i += direction
        }

        // If no sibling was found in the parent, recurse to the parent's parent
        return findEditTextInDirection(parentViewGroup, direction)
      }

      return null // Reached the top-level view, no EditText found in the specified direction
    } catch (e: ClassCastException) {
      // Handle the ClassCastException (if needed)
      // Happens when we reached out RootView and it can not be casted to ViewGroup
      return null
    }
  }

  private fun findEditTextInHierarchy(viewGroup: ViewGroup): EditText? {
    for (i in 0 until viewGroup.childCount) {
      val child = viewGroup.getChildAt(i)

      val editText = findEditTextOrGoDeeper(child)

      if (editText != null) {
        return editText
      }
    }

    return null // No EditText found in the current view group
  }

  private fun findEditTextOrGoDeeper(child: View): EditText? {
    if (child is EditText && child.isEnabled) {
      return child
    } else if (child is ViewGroup) {
      // If the child is a ViewGroup, check its children recursively
      val editText = findEditTextInHierarchy(child)

      if (editText != null) {
        return editText
      }
    }

    return null
  }
}
