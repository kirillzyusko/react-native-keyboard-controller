package com.reactnativekeyboardcontroller.traversal

import android.content.Context
import android.widget.EditText
import androidx.test.core.app.ApplicationProvider
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner

@RunWith(RobolectricTestRunner::class)
class FocusedInputHolderTest {
  @Test
  fun `FocusedInputHolder should hold a weak reference`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    var input: EditText? = EditText(context)

    FocusedInputHolder.set(input as EditText)

    assertEquals(FocusedInputHolder.get(), input)

    input = null

    @Suppress("detekt:ExplicitGarbageCollectionCall")
    System.gc()

    assertNull(FocusedInputHolder.get())
  }

  @Test
  fun `focus() should request focus on expected field`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val input = EditText(context)

    assertFalse(input.hasFocus())

    FocusedInputHolder.set(input)
    FocusedInputHolder.focus()

    assertTrue(input.hasFocus())
  }
}
