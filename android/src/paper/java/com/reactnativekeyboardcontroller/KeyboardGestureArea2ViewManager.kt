package java.com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.reactnativekeyboardcontroller.managers.KeyboardGestureArea2ViewManagerImpl
import com.reactnativekeyboardcontroller.views.KeyboardGestureAreaReactViewGroup2

class KeyboardGestureArea2ViewManager(mReactContext: ReactApplicationContext) : ViewGroupManager<KeyboardGestureAreaReactViewGroup2>() {
  private val manager = KeyboardGestureArea2ViewManagerImpl()

  override fun getName(): String = KeyboardGestureArea2ViewManagerImpl.NAME

  override fun createViewInstance(reactContext: ThemedReactContext): KeyboardGestureAreaReactViewGroup2 {
    println("AAAA AAAA AAAA")
    return manager.createViewInstance(reactContext)
  }
}
