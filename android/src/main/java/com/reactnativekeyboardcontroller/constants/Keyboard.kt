package com.reactnativekeyboardcontroller.constants

import android.os.Build

object Keyboard {
  val ARE_TRANSITIONS_EMULATED = Build.VERSION.SDK_INT < Build.VERSION_CODES.R
}
