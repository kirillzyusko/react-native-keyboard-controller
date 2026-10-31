package com.reactnativekeyboardcontroller.extensions

/** Maps a destination keyboard height to closed (0) or open (1) progress. */
val Double.progress: Double
  get() = if (this > 0.0) 1.0 else 0.0
