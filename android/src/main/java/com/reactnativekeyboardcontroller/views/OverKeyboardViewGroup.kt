package com.reactnativekeyboardcontroller.views

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Point
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
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ReactShadowNodeImpl
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.modal.ReactModalHostManager
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.views.OverKeyboardHostHelper.getModalHostSize

@SuppressLint("ViewConstructor")
class OverKeyboardHostView(private val reactContext: ThemedReactContext) : ReactViewGroup(reactContext) {
  private val dispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, this.id)
  private var windowManager: WindowManager = reactContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager
  private var hostView: OverKeyboardRootViewGroup = OverKeyboardRootViewGroup(reactContext)

  init {
    hostView.eventDispatcher = dispatcher
  }

  // region Lifecycles
  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()

    hide()
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

  override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
    // Do nothing as we are laid out by UIManager
  }
  // endregion

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

  fun hide() {
    if (hostView.isAttached) {
      windowManager.removeView(hostView)
    }
  }
}

@SuppressLint("ViewConstructor")
class OverKeyboardRootViewGroup(private val reactContext: ThemedReactContext) : ReactViewGroup(reactContext), RootView {
  private val jsTouchDispatcher: JSTouchDispatcher = JSTouchDispatcher(this)
  private var jsPointerDispatcher: JSPointerDispatcher? = null
  internal var eventDispatcher: EventDispatcher? = null
  internal var isAttached = false;

  init {
    if (ReactFeatureFlags.dispatchPointerEvents) {
      jsPointerDispatcher = JSPointerDispatcher(this)
    }
  }

  // region Lifecycles
  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    isAttached = true
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    isAttached = false
  }
  // endregion

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

/**
 * We implement the Modal by using an Android Dialog. That will fill the entire window of the
 * application. To get layout to work properly, we need to layout all the elements within the
 * Modal's inner content view as if they can fill the entire window. To do that, we need to
 * explicitly set the styleWidth and styleHeight on the LayoutShadowNode of the child of this node
 * to be the window size. This will then cause the children of the Modal to layout as if they can
 * fill the window.
 */
internal class OverKeyboardHostShadowNode : LayoutShadowNode() {
  /**
   * We need to set the styleWidth and styleHeight of the one child (represented by the
   * <View></View> within the <RCTModalHostView></RCTModalHostView> in Modal.js. This needs to fill
   * the entire window.
   */
  override fun addChildAt(child: ReactShadowNodeImpl, i: Int) {
    super.addChildAt(child, i)
    val modalSize = getModalHostSize(themedContext)
    child.setStyleWidth(modalSize.x.toFloat())
    child.setStyleHeight(modalSize.y.toFloat())
  }
}

/** Helper class for OverKeyboard. */
internal object OverKeyboardHostHelper {
  private val MIN_POINT = Point()
  private val MAX_POINT = Point()
  private val SIZE_POINT = Point()

  /**
   * To get the size of the screen, we use information from the WindowManager and default Display.
   * We don't use DisplayMetricsHolder, or Display#getSize() because they return values that include
   * the status bar. We only want the values of what will actually be shown on screen. We use
   * Display#getSize() to determine if the screen is in portrait or landscape. We don't use
   * getRotation because the 'natural' rotation will be portrait on phones and landscape on tablets.
   * This should only be called on the native modules/shadow nodes thread.
   */
  @Suppress("DEPRECATION")
  @JvmStatic
  fun getModalHostSize(context: Context): Point {
    val wm = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    val display = wm.defaultDisplay
    // getCurrentSizeRange will return the min and max width and height that the window can be
    display.getCurrentSizeRange(MIN_POINT, MAX_POINT)
    // getSize will return the dimensions of the screen in its current orientation
    display.getSize(SIZE_POINT)

    val attrs = intArrayOf(android.R.attr.windowFullscreen)
    val theme = context.theme
    val ta = theme.obtainStyledAttributes(attrs)
    val windowFullscreen = ta.getBoolean(0, false)

    // We need to add the status bar height to the height if we have a fullscreen window,
    // because Display.getCurrentSizeRange doesn't include it.
    val resources = context.resources
    @SuppressLint("DiscouragedApi", "InternalInsetResource")
    val statusBarId = resources.getIdentifier("status_bar_height", "dimen", "android")
    var statusBarHeight = 0
    if (windowFullscreen && statusBarId > 0) {
      statusBarHeight = resources.getDimension(statusBarId).toInt()
    }

    return if (SIZE_POINT.x < SIZE_POINT.y) {
      // If we are vertical the width value comes from min width and height comes from max height
      Point(MIN_POINT.x, MAX_POINT.y + statusBarHeight)
    } else {
      // If we are horizontal the width value comes from max width and height comes from min height
      Point(MAX_POINT.x, MIN_POINT.y + statusBarHeight)
    }
  }
}

