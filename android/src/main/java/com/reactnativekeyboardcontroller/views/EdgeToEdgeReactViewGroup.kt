package com.reactnativekeyboardcontroller.views

import android.annotation.SuppressLint
import android.app.Dialog
import android.content.ContextWrapper
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.view.Window
import android.widget.FrameLayout
import androidx.appcompat.widget.FitWindowsLinearLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.children
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.modal.ReactModalHostView
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.extensions.removeSelf
import com.reactnativekeyboardcontroller.extensions.requestApplyInsetsWhenAttached
import com.reactnativekeyboardcontroller.extensions.rootView
import com.reactnativekeyboardcontroller.listeners.KeyboardAnimationCallback
import java.lang.reflect.Field


private val TAG = EdgeToEdgeReactViewGroup::class.qualifiedName

fun getDialogFromView(view: View): Dialog? {
  var context = view.context
  while (context is ContextWrapper) {
    if (context is Dialog) {
      return context as Dialog
    }
    context = context.baseContext
  }
  return null // View is not inside a Dialog
}

fun getWindowFromView(view: View): Window? {
  var context = view.context
  while (context is ContextWrapper) {
    context = if (context is Dialog) {
      return (context as Dialog).window
    } else {
      context.baseContext
    }
  }
  return null // The view is not inside a Dialog
}

fun findContainingDialog(view: View?): Dialog? {
  var view = view
  while (view != null) {
    var context = view.context
    if (context is ContextWrapper) {
      context = if (context is Dialog) {
        // If the context is an instance of Dialog, we found our dialog
        return context as Dialog
      } else {
        // Otherwise, keep unwrapping the context to find the base context
        context.baseContext
      }
    }

    // If the view's parent is not a ViewGroup, we've reached the top of the view hierarchy without finding a Dialog
    if (view.parent !is ViewGroup) {
      break
    }

    // Move up in the view hierarchy
    view = view.parent as ViewGroup
  }
  return null // No containing Dialog found
}

@Suppress("detekt:TooManyFunctions")
@SuppressLint("ViewConstructor")
class EdgeToEdgeReactViewGroup(private val reactContext: ThemedReactContext) : ReactViewGroup(reactContext) {
  // props
  private var isStatusBarTranslucent = false
  private var isNavigationBarTranslucent = false
  private var active = false

  // internal class members
  private var eventView: ReactViewGroup? = null
  private var wasMounted = false
  private var callback: KeyboardAnimationCallback? = null

  // region View lifecycles
  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    if (!wasMounted) {
      // skip logic with callback re-creation if it was first render/mount
      wasMounted = true
      return
    }

    this.setupKeyboardCallbacks()

    println("onAttachedToWindow ${this} ${getDialogFromView(this)} ${this.parent.parent.parent} ${this.children} ${this.context.applicationContext} ${getWindowFromView(this)}")
    println("${(this.parent?.parent?.parent?.parent?.parent?.parent?.parent)}") // decor view
    println("${(this.parent?.parent?.parent)}") // ModalRootView
    println("${this.parent?.parent?.parent?.javaClass?.simpleName} ${(this.parent?.parent?.parent as ReactViewGroup).context} ${reactContext}") // ModalRootView
    println("${findContainingDialog(this)}")

    try {
      val mHostView = this.parent.parent.parent

      mHostView.javaClass.declaredFields.forEach { field ->
        println(field.name)
      }

      val outerClassReferenceField = mHostView.javaClass.getDeclaredField("this$0").apply {
        isAccessible = true
      }
      val reactModalHostViewInstance1 = outerClassReferenceField.get(mHostView) as ReactModalHostView

      println("reactModalHostViewInstance1:: ${reactModalHostViewInstance1}")

      // Hypothetical method to get the ReactModalHostView instance from mHostView
      val reactModalHostViewInstanceMethod = mHostView::class.java.getMethod("getContext")
      val reactModalHostViewInstance = reactModalHostViewInstanceMethod.invoke(mHostView) as? ReactModalHostView

      if (reactModalHostViewInstance != null) {
        // Now that you have the ReactModalHostView instance, access the mDialog field
        val field: Field = ReactModalHostView::class.java.getDeclaredField("mDialog")
        field.isAccessible = true  // Make the private field accessible

        val mDialog: Dialog? = field.get(reactModalHostViewInstance) as? Dialog

        // Use mDialog as needed
        if (mDialog != null) {
          // Do something with mDialog
        } else {
          println("mDialog is null")
        }
      } else {
        println("Failed to obtain ReactModalHostView instance from mHostView")
      }
    } catch (e: Exception) {
      e.printStackTrace()
      println("An error occurred")
    }

    // This would be the parent view that potentially contains ReactModalHostView
    if (false && this.parent?.parent?.parent != null && this.parent?.parent?.parent?.javaClass?.simpleName == "DialogRootViewGroup") {
      val instanceC = this.parent.parent.parent
      // Using reflection to access the 'this$0' field from C, which refers to its enclosing instance of A
      val `this$0Field`: Field = instanceC.javaClass.getDeclaredField("this$0")
      `this$0Field`.isAccessible = true
      val instanceA: ReactModalHostView = `this$0Field`[instanceC] as ReactModalHostView
println(instanceA)
      // Now that we have the instance of A, we can use reflection again to access propertyB
      // Now that we have the instance of A, we can use reflection again to access propertyB
      // val propertyBField: Field = A::class.java.getDeclaredField("propertyB")
      // propertyBField.isAccessible = true
      // val propertyB: A.B = propertyBField[instanceA] as A.B
    }
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()

    this.removeKeyboardCallbacks()

    // println("onDetachedFromWindow ${this} ${getDialogFromView(this)} ${this.parent} ${this.children}")
  }
  // endregion

  // region State manager helpers
  private fun setupWindowInsets() {
    val rootView = reactContext.rootView
    if (rootView != null) {
      ViewCompat.setOnApplyWindowInsetsListener(rootView) { v, insets ->
        val content = getContentView()
        val params = FrameLayout.LayoutParams(
          FrameLayout.LayoutParams.MATCH_PARENT,
          FrameLayout.LayoutParams.MATCH_PARENT,
        )

        val shouldApplyZeroPaddingTop = !active || this.isStatusBarTranslucent
        val shouldApplyZeroPaddingBottom = !active || this.isNavigationBarTranslucent
        params.setMargins(
          0,
          if (shouldApplyZeroPaddingTop) {
            0
          } else {
            (
              insets?.getInsets(WindowInsetsCompat.Type.systemBars())?.top
                ?: 0
              )
          },
          0,
          if (shouldApplyZeroPaddingBottom) {
            0
          } else {
            insets?.getInsets(WindowInsetsCompat.Type.navigationBars())?.bottom
              ?: 0
          },
        )

        content?.layoutParams = params

        val defaultInsets = ViewCompat.onApplyWindowInsets(v, insets)

        defaultInsets.replaceSystemWindowInsets(
          defaultInsets.systemWindowInsetLeft,
          if (this.isStatusBarTranslucent) 0 else defaultInsets.systemWindowInsetTop,
          defaultInsets.systemWindowInsetRight,
          defaultInsets.systemWindowInsetBottom,
        )
      }
    }
  }

  private fun goToEdgeToEdge(edgeToEdge: Boolean) {
    val a = this.parent
    println("goToEdgeToEdge ${this} ${getDialogFromView(this)} ${this.parent} ${this.children}")
    reactContext.currentActivity?.let {
      WindowCompat.setDecorFitsSystemWindows(
        it.window,
        !edgeToEdge,
      )
    }
  }

  private fun setupKeyboardCallbacks() {
    val activity = reactContext.currentActivity

    if (activity != null) {
      eventView = ReactViewGroup(context)
      val root = this.getContentView()
      root?.addView(eventView)

      callback = KeyboardAnimationCallback(
        view = this,
        persistentInsetTypes = WindowInsetsCompat.Type.systemBars(),
        deferredInsetTypes = WindowInsetsCompat.Type.ime(),
        dispatchMode = WindowInsetsAnimationCompat.Callback.DISPATCH_MODE_CONTINUE_ON_SUBTREE,
        context = reactContext,
      )

      eventView?.let {
        ViewCompat.setWindowInsetsAnimationCallback(it, callback)
        ViewCompat.setOnApplyWindowInsetsListener(it, callback)
        it.requestApplyInsetsWhenAttached()
      }
    } else {
      Log.w(TAG, "Can not setup keyboard animation listener, since `currentActivity` is null")
    }
  }

  private fun removeKeyboardCallbacks() {
    callback?.destroy()

    // capture view into closure, because if `onDetachedFromWindow` and `onAttachedToWindow`
    // dispatched synchronously after each other (open application on Fabric), then `.post`
    // will destroy just newly created view (if we have a reference via `this`)
    // and we'll have a memory leak or zombie-view
    val view = eventView
    // we need to remove view asynchronously from `onDetachedFromWindow` method
    // otherwise we may face NPE when app is getting opened via universal link
    // see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/242
    // for more details
    Handler(Looper.getMainLooper()).post { view.removeSelf() }
  }

  private fun getContentView(): FitWindowsLinearLayout? {
    return reactContext.currentActivity?.window?.decorView?.rootView?.findViewById(
      androidx.appcompat.R.id.action_bar_root,
    )
  }
  // endregion

  // region State managers
  private fun enable() {
    this.goToEdgeToEdge(true)
    this.setupWindowInsets()
    this.setupKeyboardCallbacks()
  }

  private fun disable() {
    this.goToEdgeToEdge(false)
    this.setupWindowInsets()
    this.removeKeyboardCallbacks()
  }
  // endregion

  // region Props setters
  fun setStatusBarTranslucent(isStatusBarTranslucent: Boolean) {
    this.isStatusBarTranslucent = isStatusBarTranslucent
  }

  fun setNavigationBarTranslucent(isNavigationBarTranslucent: Boolean) {
    this.isNavigationBarTranslucent = isNavigationBarTranslucent
  }

  fun setActive(active: Boolean) {
    this.active = active

    if (active) {
      this.enable()
    } else {
      this.disable()
    }
  }
  // endregion
}
