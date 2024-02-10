package com.reactnativekeyboardcontroller.traversal

import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.views.textinput.ReactEditText

object ViewHierarchyNavigator {
  fun setFocusTo(direction: String, view: View) {
    val input = if (direction == "next") findNextEditText(view) else findPreviousEditText(view)

    UiThreadUtil.runOnUiThread {
      if (input is ReactEditText) {
        input.requestFocusFromJS()
      } else {
        input?.requestFocus()
      }
    }
  }

  fun getAllInputFields(viewGroup: View?): List<EditText> {
    val editTexts = mutableListOf<EditText>()

    // Helper function to recursively search for EditText views
    fun findEditTexts(view: View?) {
      if (view is EditText) {
        editTexts.add(view)
      } else if (view is ViewGroup) {
        for (i in 0 until view.childCount) {
          findEditTexts(view.getChildAt(i))
        }
      }
    }

    // Start the search with the provided viewGroup
    findEditTexts(viewGroup)

    return editTexts
  }

  private fun findNextEditText(currentFocus: View): EditText? {
    return findEditTextInDirection(currentFocus, 1)
  }

  private fun findPreviousEditText(currentFocus: View): EditText? {
    return findEditTextInDirection(currentFocus, -1)
  }

  @Suppress("detekt:ReturnCount")
  private fun findEditTextInDirection(currentFocus: View, direction: Int): EditText? {
    // Attempt to find the parent view group, return null if not found or not a ViewGroup
    val parentViewGroup = currentFocus.parent as? ViewGroup ?: return null

    // Find the index of the current EditText in its parent
    val currentIndex = parentViewGroup.indexOfChild(currentFocus)

    // Determine the start index and end condition for the loop based on the direction
    var i = if (direction > 0) currentIndex + 1 else currentIndex - 1
    val end = if (direction > 0) parentViewGroup.childCount else -1

    // Iterate over siblings in the specified direction
    while (i != end) {
      val nextChild = parentViewGroup.getChildAt(i)
      findEditTextOrGoDeeper(nextChild)?.let { return it } // Return if an EditText is found
      i += direction
    }

    // Recurse to the parent's parent if no sibling EditText is found
    return findEditTextInDirection(parentViewGroup, direction)
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
    var result: EditText? = null

    if (child is EditText && child.isEnabled) {
      result = child
    } else if (child is ViewGroup) {
      // If the child is a ViewGroup, check its children recursively
      result = findEditTextInHierarchy(child)
    }

    return result
  }
}
