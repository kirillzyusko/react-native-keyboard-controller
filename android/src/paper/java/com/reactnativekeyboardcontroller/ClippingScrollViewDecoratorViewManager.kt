package java.com.reactnativekeyboardcontroller

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.reactnativekeyboardcontroller.managers.ClippingScrollViewDecoratorViewManagerImpl
import com.reactnativekeyboardcontroller.views.ClippingScrollViewDecoratorView

class ClippingScrollViewDecoratorViewManager : ViewGroupManager<ClippingScrollViewDecoratorView>() {
  private val manager = ClippingScrollViewDecoratorViewManagerImpl()

  override fun getName(): String = ClippingScrollViewDecoratorViewManagerImpl.NAME

  override fun createViewInstance(reactContext: ThemedReactContext): ClippingScrollViewDecoratorView =
    manager.createViewInstance(reactContext)

  @ReactProp(name = "contentInsetBottom")
  fun setContentInsetBottom(
    view: ClippingScrollViewDecoratorView,
    value: Double,
  ) {
    view.setContentInsetBottom(value)
  }
}
