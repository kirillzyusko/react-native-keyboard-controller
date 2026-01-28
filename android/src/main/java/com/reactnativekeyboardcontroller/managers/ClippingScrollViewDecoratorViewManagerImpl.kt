package com.reactnativekeyboardcontroller.managers

import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativekeyboardcontroller.views.ClippingScrollViewDecoratorView

class ClippingScrollViewDecoratorViewManagerImpl {
  fun createViewInstance(reactContext: ThemedReactContext): ClippingScrollViewDecoratorView =
    ClippingScrollViewDecoratorView(reactContext)

  companion object {
    const val NAME = "ClippingScrollViewDecoratorView"
  }
}
