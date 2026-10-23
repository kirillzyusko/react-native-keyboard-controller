package com.reactnativekeyboardcontroller.extensions

import android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING
import android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN
import android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE
import android.view.WindowManager.LayoutParams.SOFT_INPUT_IS_FORWARD_NAVIGATION
import android.view.WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

@Suppress("DEPRECATION")
class SoftInputModeTest {
  @Test
  fun `isAdjustResize should be true for adjustResize`() {
    assertTrue(isAdjustResize(SOFT_INPUT_ADJUST_RESIZE))
  }

  @Test
  fun `isAdjustResize should ignore forward navigation and state flags`() {
    assertTrue(isAdjustResize(SOFT_INPUT_ADJUST_RESIZE or SOFT_INPUT_IS_FORWARD_NAVIGATION))
    assertTrue(isAdjustResize(SOFT_INPUT_ADJUST_RESIZE or SOFT_INPUT_STATE_HIDDEN))
  }

  @Test
  fun `isAdjustResize should be false for other adjust modes`() {
    assertFalse(isAdjustResize(SOFT_INPUT_ADJUST_PAN or SOFT_INPUT_IS_FORWARD_NAVIGATION))
    assertFalse(isAdjustResize(SOFT_INPUT_ADJUST_NOTHING))
  }
}
