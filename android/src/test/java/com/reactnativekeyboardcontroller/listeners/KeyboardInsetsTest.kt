package com.reactnativekeyboardcontroller.listeners

import org.junit.Assert.assertEquals
import org.junit.Test

class KeyboardInsetsTest {
  @Test
  fun `IME contained in the translucent navigation bar has zero height`() {
    assertEquals(0, resolveKeyboardHeight(126, 126, true))
    assertEquals(0, resolveKeyboardHeight(94, 126, true))
  }

  @Test
  fun `docked IME includes the translucent navigation bar`() {
    assertEquals(883, resolveKeyboardHeight(883, 126, true))
    assertEquals(126, resolveKeyboardHeight(126, 0, true))
  }

  @Test
  fun `opaque navigation bar is excluded from the IME height`() {
    assertEquals(757, resolveKeyboardHeight(883, 126, false))
    assertEquals(0, resolveKeyboardHeight(126, 126, false))
  }

  @Test
  fun `IME with no bottom inset has zero height`() {
    assertEquals(0, resolveKeyboardHeight(0, 126, true))
    assertEquals(0, resolveKeyboardHeight(0, 126, false))
  }
}
