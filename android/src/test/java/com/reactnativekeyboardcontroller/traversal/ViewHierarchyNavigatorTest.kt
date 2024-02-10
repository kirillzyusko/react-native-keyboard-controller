package com.reactnativekeyboardcontroller.traversal

import android.content.Context
import android.widget.EditText
import android.widget.LinearLayout
import androidx.test.core.app.ApplicationProvider
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.shadows.ShadowLooper

@RunWith(RobolectricTestRunner::class)
class ViewHierarchyNavigatorTest {
  @Test
  fun `getAllInputFields returns all EditTexts in ViewGroup`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val viewGroup = LinearLayout(context).apply {
      addView(EditText(context))
      addView(EditText(context))
      addView(
        LinearLayout(context).apply {
          addView(EditText(context))
        },
      )
    }

    val editTexts = ViewHierarchyNavigator.getAllInputFields(viewGroup)

    assertTrue(editTexts.size == 3)
  }

  @Test
  fun `setFocusTo to 'next' should set focus to next field`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val layout = LinearLayout(context).apply {
      orientation = LinearLayout.VERTICAL
    }

    // Create EditText views and add them to the layout
    val editText1 = EditText(context)
    val editText2 = EditText(context)

    layout.addView(editText1)
    layout.addView(editText2)

    // Set focus to the first EditText
    editText1.requestFocus()

    // Use ViewHierarchyNavigator to shift focus
    ViewHierarchyNavigator.setFocusTo("next", editText1)

    ShadowLooper.runUiThreadTasksIncludingDelayedTasks()

    // Assert that the second EditText now has focus
    assertTrue(editText2.hasFocus())
  }
}
