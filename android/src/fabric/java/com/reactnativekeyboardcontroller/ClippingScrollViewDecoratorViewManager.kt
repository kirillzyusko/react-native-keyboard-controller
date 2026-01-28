package java.com.reactnativekeyboardcontroller

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.ClippingScrollViewDecoratorViewManagerDelegate
import com.facebook.react.viewmanagers.ClippingScrollViewDecoratorViewManagerInterface
import com.reactnativekeyboardcontroller.managers.ClippingScrollViewDecoratorViewManagerImpl
import com.reactnativekeyboardcontroller.views.ClippingScrollViewDecoratorView

class ClippingScrollViewDecoratorViewManager :
  ViewGroupManager<ClippingScrollViewDecoratorView>(),
  ClippingScrollViewDecoratorViewManagerInterface<ClippingScrollViewDecoratorView> {
  private val manager = ClippingScrollViewDecoratorViewManagerImpl()
  private val mDelegate = ClippingScrollViewDecoratorViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<ClippingScrollViewDecoratorView> = mDelegate

  override fun getName(): String = ClippingScrollViewDecoratorViewManagerImpl.NAME

  override fun createViewInstance(context: ThemedReactContext): ClippingScrollViewDecoratorView =
    manager.createViewInstance(context)

  override fun setContentInsetBottom(
    view: ClippingScrollViewDecoratorView?,
    value: Double,
  ) {
    view?.setContentInsetBottom(value)
  }
}
