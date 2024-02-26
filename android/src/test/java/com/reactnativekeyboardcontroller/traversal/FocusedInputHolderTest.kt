package com.reactnativekeyboardcontroller.traversal

import android.content.Context
import android.widget.EditText
import androidx.test.core.app.ApplicationProvider
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
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

    assertNotNull(FocusedInputHolder.get())

    input = null

    @Suppress("detekt:ExplicitGarbageCollectionCall")
    System.gc()

    assertNull(FocusedInputHolder.get())
  }
}
