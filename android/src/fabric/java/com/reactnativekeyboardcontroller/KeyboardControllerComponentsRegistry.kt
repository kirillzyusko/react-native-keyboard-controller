package com.reactnativekeyboardcontroller

import com.facebook.jni.HybridData
import com.facebook.proguard.annotations.DoNotStrip
import com.facebook.react.fabric.ComponentFactory
import com.facebook.soloader.SoLoader

@DoNotStrip
class KeyboardControllerComponentsRegistry @DoNotStrip private constructor(componentFactory: ComponentFactory) {
  companion object {
    @DoNotStrip
    fun register(componentFactory: ComponentFactory): KeyboardControllerComponentsRegistry {
      return KeyboardControllerComponentsRegistry(componentFactory)
    }

    init {
      SoLoader.loadLibrary("fabricjni")
      SoLoader.loadLibrary("reactnativekeyboardcontroller_modules")
    }
  }

  @DoNotStrip
  private val mHybridData: HybridData

  @DoNotStrip
  private external fun initHybrid(componentFactory: ComponentFactory): HybridData

  init {
    mHybridData = initHybrid(componentFactory)
  }
}
