package com.reactnativekeyboardcontroller.traversal

import android.content.Context
import android.widget.EditText
import android.widget.LinearLayout
import androidx.test.core.app.ApplicationProvider
import com.reactnativekeyboardcontroller.extensions.focus
import com.reactnativekeyboardcontroller.views.KeyboardToolbarGroupReactViewGroup
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.shadows.ShadowLooper

@RunWith(RobolectricTestRunner::class)
class ViewHierarchyNavigatorGroupTest {
  private lateinit var layout: LinearLayout
  private lateinit var editText1: EditText
  private lateinit var editText2: EditText
  private lateinit var groupEditText1: EditText
  private lateinit var groupEditText2: EditText
  private lateinit var groupEditText3: EditText
  private lateinit var editText3: EditText
  private lateinit var editText4: EditText
  private lateinit var group: KeyboardToolbarGroupReactViewGroup

  @Before
  fun setUp() {
    val context = ApplicationProvider.getApplicationContext<Context>()

    editText1 = EditText(context).apply { id = 1 }
    editText2 = EditText(context).apply { id = 2 }
    groupEditText1 = EditText(context).apply { id = 3 }
    groupEditText2 = EditText(context).apply { id = 4 }
    groupEditText3 = EditText(context).apply { id = 5 }
    editText3 = EditText(context).apply { id = 6 }
    editText4 = EditText(context).apply { id = 7 }

    group =
      KeyboardToolbarGroupReactViewGroup(context).apply {
        addView(groupEditText1)
        addView(groupEditText2)
        addView(groupEditText3)
      }

    // Layout: editText1, editText2, [group: gET1, gET2, gET3], editText3, editText4
    layout =
      LinearLayout(context).apply {
        addView(editText1)
        addView(editText2)
        addView(group)
        addView(editText3)
        addView(editText4)
      }
  }

  @Test
  fun `getAllInputFields should not include inputs inside a group`() {
    val editTexts = ViewHierarchyNavigator.getAllInputFields(layout)

    // Only editText1, editText2, editText3, editText4 (group inputs excluded)
    assertTrue(editTexts.size == 4)
  }

  @Test
  fun `getAllInputFields with group as root should return only group inputs`() {
    val editTexts = ViewHierarchyNavigator.getAllInputFields(group)

    assertTrue(editTexts.size == 3)
  }

  @Test
  fun `setFocusTo 'next' inside group should stay within group`() {
    groupEditText1.focus()

    ViewHierarchyNavigator.setFocusTo("next", groupEditText1)

    ShadowLooper.runUiThreadTasksIncludingDelayedTasks()

    assertTrue(groupEditText2.hasFocus())
  }

  @Test
  fun `setFocusTo 'prev' inside group should stay within group`() {
    groupEditText3.focus()

    ViewHierarchyNavigator.setFocusTo("prev", groupEditText3)

    ShadowLooper.runUiThreadTasksIncludingDelayedTasks()

    assertTrue(groupEditText2.hasFocus())
  }

  @Test
  fun `setFocusTo 'next' at last group input should not leave group`() {
    groupEditText3.focus()

    ViewHierarchyNavigator.setFocusTo("next", groupEditText3)

    ShadowLooper.runUiThreadTasksIncludingDelayedTasks()

    // Should stay on last group input, not move to editText3
    assertTrue(groupEditText3.hasFocus())
  }

  @Test
  fun `setFocusTo 'prev' at first group input should not leave group`() {
    groupEditText1.focus()

    ViewHierarchyNavigator.setFocusTo("prev", groupEditText1)

    ShadowLooper.runUiThreadTasksIncludingDelayedTasks()

    // Should stay on first group input, not move to editText2
    assertTrue(groupEditText1.hasFocus())
  }

  @Test
  fun `setFocusTo 'next' outside group should skip group inputs`() {
    editText2.focus()

    ViewHierarchyNavigator.setFocusTo("next", editText2)

    ShadowLooper.runUiThreadTasksIncludingDelayedTasks()

    // Should skip group and go to editText3
    assertTrue(editText3.hasFocus())
  }

  @Test
  fun `setFocusTo 'prev' outside group should skip group inputs`() {
    editText3.focus()

    ViewHierarchyNavigator.setFocusTo("prev", editText3)

    ShadowLooper.runUiThreadTasksIncludingDelayedTasks()

    // Should skip group and go to editText2
    assertTrue(editText2.hasFocus())
  }

  @Test
  fun `findGroupAncestor should return group for inputs inside group`() {
    val ancestor = ViewHierarchyNavigator.findGroupAncestor(groupEditText1)

    assertTrue(ancestor === group)
  }

  @Test
  fun `findGroupAncestor should return null for inputs outside group`() {
    val ancestor = ViewHierarchyNavigator.findGroupAncestor(editText1)

    assertNull(ancestor)
  }
}
