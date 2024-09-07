package com.reactnativekeyboardcontroller.views

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.graphics.PixelFormat
import android.util.Log
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.Button
import android.widget.PopupWindow
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.config.ReactFeatureFlags
import com.facebook.react.uimanager.JSPointerDispatcher
import com.facebook.react.uimanager.JSTouchDispatcher
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.view.ReactViewGroup

@SuppressLint("ViewConstructor")
class OverKeyboardHostView(private val reactContext: ThemedReactContext) : ReactViewGroup(reactContext) {
  private val dispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, this.id)
  private var windowManager: WindowManager = reactContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager
  private var hostView: OverKeyboardRootViewGroup = OverKeyboardRootViewGroup(reactContext)

  init {
    hostView.eventDispatcher = dispatcher
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()

    windowManager.removeView(hostView)
  }

  override fun addView(child: View?, index: Int) {
    UiThreadUtil.assertOnUiThread()
    hostView.addView(child, index)
  }

  override fun getChildCount(): Int = hostView.childCount

  override fun getChildAt(index: Int): View? = hostView.getChildAt(index)

  override fun removeView(child: View?) {
    UiThreadUtil.assertOnUiThread()

    if (child != null) {
      hostView.removeView(child)
    }
  }

  override fun removeViewAt(index: Int) {
    UiThreadUtil.assertOnUiThread()
    val child = getChildAt(index)
    hostView.removeView(child)
  }

  fun show() {
    val layoutParams = WindowManager.LayoutParams(
      WindowManager.LayoutParams.MATCH_PARENT, // Width
      WindowManager.LayoutParams.MATCH_PARENT, // Height in pixels
      // This type ensures it floats over other application windows but under system windows
      WindowManager.LayoutParams.TYPE_APPLICATION_PANEL,
      // Ensures touches outside the view pass through to other windows
      WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
      PixelFormat.TRANSLUCENT
    )

    // Now add the view to the WindowManager
    windowManager.addView(hostView, layoutParams)
  }
}

@SuppressLint("ViewConstructor")
class OverKeyboardRootViewGroup(private val reactContext: ThemedReactContext) : ReactViewGroup(reactContext), RootView {
  private val jsTouchDispatcher: JSTouchDispatcher = JSTouchDispatcher(this)
  private var jsPointerDispatcher: JSPointerDispatcher? = null
  internal var eventDispatcher: EventDispatcher? = null

  init {
    if (ReactFeatureFlags.dispatchPointerEvents) {
      jsPointerDispatcher = JSPointerDispatcher(this)
    }
  }

  // region Touch events handling
  override fun onInterceptTouchEvent(event: MotionEvent): Boolean {
    eventDispatcher?.let { eventDispatcher ->
      jsTouchDispatcher.handleTouchEvent(event, eventDispatcher)
      jsPointerDispatcher?.handleMotionEvent(event, eventDispatcher, true)
    }
    return super.onInterceptTouchEvent(event)
  }

  @SuppressLint("ClickableViewAccessibility")
  override fun onTouchEvent(event: MotionEvent): Boolean {
    eventDispatcher?.let { eventDispatcher ->
      jsTouchDispatcher.handleTouchEvent(event, eventDispatcher)
      jsPointerDispatcher?.handleMotionEvent(event, eventDispatcher, false)
    }
    super.onTouchEvent(event)
    // In case when there is no children interested in handling touch event, we return true from
    // the root view in order to receive subsequent events related to that gesture
    return true
  }

  override fun onInterceptHoverEvent(event: MotionEvent): Boolean {
    eventDispatcher?.let { jsPointerDispatcher?.handleMotionEvent(event, it, true) }
    return super.onHoverEvent(event)
  }

  override fun onHoverEvent(event: MotionEvent): Boolean {
    eventDispatcher?.let { jsPointerDispatcher?.handleMotionEvent(event, it, false) }
    return super.onHoverEvent(event)
  }

  override fun requestDisallowInterceptTouchEvent(disallowIntercept: Boolean) {
    // No-op - override in order to still receive events to onInterceptTouchEvent
    // even when some other view disallow that
  }
  // endregion

  // region RootView methods
  override fun onChildStartedNativeGesture(childView: View, ev: MotionEvent) {
    eventDispatcher?.let { eventDispatcher ->
      jsTouchDispatcher.onChildStartedNativeGesture(ev, eventDispatcher)
      jsPointerDispatcher?.onChildStartedNativeGesture(childView, ev, eventDispatcher)
    }
  }

  override fun onChildEndedNativeGesture(childView: View, ev: MotionEvent) {
    eventDispatcher?.let { jsTouchDispatcher.onChildEndedNativeGesture(ev, it) }
    jsPointerDispatcher?.onChildEndedNativeGesture()
  }

  override fun handleException(t: Throwable) {
    reactContext.reactApplicationContext.handleException(RuntimeException(t))
  }
  // endregion
}
