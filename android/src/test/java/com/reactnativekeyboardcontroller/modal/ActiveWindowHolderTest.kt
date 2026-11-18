package com.reactnativekeyboardcontroller.modal

import android.app.Activity
import android.app.Dialog
import org.junit.After
import org.junit.Assert.assertNull
import org.junit.Assert.assertSame
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.Robolectric
import org.robolectric.RobolectricTestRunner

@RunWith(RobolectricTestRunner::class)
class ActiveWindowHolderTest {
  private val activity = Robolectric.buildActivity(Activity::class.java).setup().get()
  private val first = requireNotNull(Dialog(activity).window)
  private val second = requireNotNull(Dialog(activity).window)

  @After
  fun tearDown() {
    ActiveWindowHolder.remove(first)
    ActiveWindowHolder.remove(second)
  }

  @Test
  fun `get() should return null when no modal is shown`() {
    assertNull(ActiveWindowHolder.get())
  }

  @Test
  fun `get() should return the window of the top-most modal`() {
    ActiveWindowHolder.add(first)
    ActiveWindowHolder.add(second)

    assertSame(second, ActiveWindowHolder.get())
  }

  @Test
  fun `get() should return the previous window when the top-most modal is closed`() {
    ActiveWindowHolder.add(first)
    ActiveWindowHolder.add(second)

    ActiveWindowHolder.remove(second)
    assertSame(first, ActiveWindowHolder.get())

    ActiveWindowHolder.remove(first)
    assertNull(ActiveWindowHolder.get())
  }
}
