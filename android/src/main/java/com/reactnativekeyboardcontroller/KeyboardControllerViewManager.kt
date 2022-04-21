package com.reactnativekeyboardcontroller

import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager
import com.reactnativekeyboardcontroller.events.KeyboardTransitionEvent
import java.util.*
import kotlin.concurrent.schedule


// 1. (x) Конструктор не вызывается, листенеры не вешаются (init)
// 2. (x) ивенты не диспатчатся
// 3. WindowCompat.setDecorFitsSystemWindows(window, false)?
// 4. adjustResize
// 5. (x) onProgress не вызывается (getExportedCustomDirectEventTypeConstants, not bubble)
// 6. (x) Стили не применяются к кастомной вьюшке - унаследовался от реактовской компоненты
// 7. (x) Не мапится ивент на анимейтед (addListener ничего не возвращает) - see 5, 8
// 8. (x) useNativeDriver: false - createAnimatedComponent
class KeyboardControllerViewManager(reactContext: ReactApplicationContext?) : ReactViewManager() {
  private var mReactContext = reactContext;
  init {
    /*println("LALALA")

    val window = (reactContext?.currentActivity)?.window!!
    // Tell the Window that our app is going to responsible for fitting for any system windows.
    WindowCompat.setDecorFitsSystemWindows(window, false)

    val rootLayout = (reactContext?.currentActivity)?.window?.decorView?.findViewById<View>(android.R.id.content)
    ViewCompat.setWindowInsetsAnimationCallback(
      rootLayout!!,
      TranslateDeferringInsetsAnimationCallback(
        persistentInsetTypes = WindowInsetsCompat.Type.systemBars(),
        deferredInsetTypes = WindowInsetsCompat.Type.ime(),
        // We explicitly allow dispatch to continue down to binding.messageHolder's
        // child views, so that step 2.5 below receives the call
        dispatchMode = WindowInsetsAnimationCompat.Callback.DISPATCH_MODE_CONTINUE_ON_SUBTREE,
        context = reactContext
      )
    )*/
  }

  override fun getName() = "KeyboardControllerView"

  override fun createViewInstance(reactContext: ThemedReactContext): ReactViewGroup {
    val view = ReactViewGroup(reactContext)

    reactContext.currentActivity?.let { WindowCompat.setDecorFitsSystemWindows(it.window, false) }

    /*Timer("SettingUp", false).schedule(4500) {
      for (i in 0..360) {
        Thread.sleep(8 )
        mReactContext
          ?.getNativeModule(UIManagerModule::class.java)
          ?.eventDispatcher
          ?.dispatchEvent(KeyboardTransitionEvent(view.id, i.toFloat() / 2))
        }
      }*/

    // TODO: maybe it will work here? (why statusbar is gray by default?)
    ViewCompat.setWindowInsetsAnimationCallback(
      reactContext.currentActivity!!.window!!.decorView,
      TranslateDeferringInsetsAnimationCallback(
        view = view,
        persistentInsetTypes = WindowInsetsCompat.Type.systemBars(),
        deferredInsetTypes = WindowInsetsCompat.Type.ime(),
        // We explicitly allow dispatch to continue down to binding.messageHolder's
        // child views, so that step 2.5 below receives the call
        dispatchMode = WindowInsetsAnimationCompat.Callback.DISPATCH_MODE_CONTINUE_ON_SUBTREE,
        context = mReactContext
      )
    )
    return view
  }

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
    val map: MutableMap<String, Any> = MapBuilder.of(
      KeyboardTransitionEvent.EVENT_NAME,
      MapBuilder.of("registrationName", "onProgress")
    )

    return map
  }
}
