package com.reactnativekeyboardcontroller.traversal

import android.content.Context
import android.widget.LinearLayout
import android.widget.EditText
import androidx.test.core.app.ApplicationProvider
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner

@RunWith(RobolectricTestRunner::class)
class ViewHierarchyNavigatorTest {
  @Test
  fun `getAllInputFields returns all EditTexts in ViewGroup`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val viewGroup = LinearLayout(context).apply {
      addView(EditText(context))
      addView(EditText(context))
      addView(LinearLayout(context).apply {
        addView(EditText(context))
      })
    }

    val editTexts = ViewHierarchyNavigator.getAllInputFields(viewGroup)

    assertTrue(editTexts.size == 3)
  }
}
