package com.reactnativekeyboardcontroller.traversal

import android.content.Context
import android.widget.EditText
import android.widget.LinearLayout
import androidx.test.core.app.ApplicationProvider
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.shadows.ShadowLooper

@RunWith(RobolectricTestRunner::class)
class ViewHierarchyNavigatorTest {
  private lateinit var layout: LinearLayout
  private lateinit var editText1: EditText
  private lateinit var editText2: EditText
  private lateinit var editText3: EditText
  private lateinit var editText4: EditText
  private lateinit var editText5: EditText
  private lateinit var editText6: EditText
  private lateinit var editText7: EditText
  private lateinit var editText8: EditText
  private lateinit var editText9: EditText
  private lateinit var editText10: EditText
  private lateinit var editText11: EditText
  private lateinit var editText12: EditText
  private lateinit var editText13: EditText

  @Suppress("detekt:CyclomaticComplexMethod")
  @Before
  fun setUp() {
    val context = ApplicationProvider.getApplicationContext<Context>()

    editText1 = EditText(context).apply { id = 1 }
    editText2 = EditText(context).apply { id = 2 }
    editText3 = EditText(context).apply { id = 3; isEnabled = false }
    editText4 = EditText(context).apply { id = 4; isEnabled = false }
    editText5 = EditText(context).apply { id = 5 }
    editText6 = EditText(context).apply { id = 6 }
    editText7 = EditText(context).apply { id = 7 }
    editText8 = EditText(context).apply { id = 8 }
    editText9 = EditText(context).apply { id = 9 }
    editText10 = EditText(context).apply { id = 10 }
    editText11 = EditText(context).apply { id = 11 }
    editText12 = EditText(context).apply { id = 12 }
    editText13 = EditText(context).apply { id = 13 }

    layout = LinearLayout(context).apply {
      addView(editText1)
      addView(editText2)
      addView(editText3)
      addView(editText4)
      addView(
        LinearLayout(context).apply {
          addView(editText5)
          addView(editText6)
          addView(editText7)
        },
      )
      addView(editText8)
      addView(editText9)
      addView(editText10)
      addView(editText11)
      addView(editText12)
      addView(editText13)
    }
  }

  @Test
  fun `getAllInputFields returns all EditTexts in ViewGroup`() {
    val editTexts = ViewHierarchyNavigator.getAllInputFields(layout)

    assertTrue(editTexts.size == 13)
  }

  @Test
  fun `setFocusTo to 'next' should set focus to next field`() {
    editText1.requestFocus()

    ViewHierarchyNavigator.setFocusTo("next", editText1)

    ShadowLooper.runUiThreadTasksIncludingDelayedTasks()

    assertTrue(editText2.hasFocus())
  }

  @Test
  fun `setFocusTo to 'prev' should set focus to previous field`() {
    editText2.requestFocus()

    ViewHierarchyNavigator.setFocusTo("prev", editText2)

    ShadowLooper.runUiThreadTasksIncludingDelayedTasks()

    assertTrue(editText1.hasFocus())
  }

  @Test
  fun `setFocusTo to 'next' should skip non-editable fields`() {
    editText2.requestFocus()

    ViewHierarchyNavigator.setFocusTo("next", editText2)

    ShadowLooper.runUiThreadTasksIncludingDelayedTasks()

    assertTrue(editText5.hasFocus())
  }

  @Test
  fun `setFocusTo to 'prev' should skip non-editable fields`() {
    editText5.requestFocus()

    ViewHierarchyNavigator.setFocusTo("prev", editText5)

    ShadowLooper.runUiThreadTasksIncludingDelayedTasks()

    assertTrue(editText2.hasFocus())
  }

  @Test
  fun `setFocusTo to 'next' should set focus relatively to current group`() {
    editText5.requestFocus()

    ViewHierarchyNavigator.setFocusTo("next", editText5)

    ShadowLooper.runUiThreadTasksIncludingDelayedTasks()

    assertTrue(editText6.hasFocus())
  }

  @Test
  fun `setFocusTo to 'next' should correctly exit from current group`() {
    editText7.requestFocus()

    ViewHierarchyNavigator.setFocusTo("next", editText7)

    ShadowLooper.runUiThreadTasksIncludingDelayedTasks()

    assertTrue(editText8.hasFocus())
  }
}
