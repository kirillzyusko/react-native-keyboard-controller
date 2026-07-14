package com.reactnativekeyboardcontroller.views.customkeyboard

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.Configuration
import android.graphics.PixelFormat
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.ViewTreeObserver
import android.view.WindowManager
import android.view.accessibility.AccessibilityEvent
import android.view.animation.DecelerateInterpolator
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.config.ReactFeatureFlags
import com.facebook.react.uimanager.JSTouchDispatcher
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.view.ReactViewGroup
import com.reactnativekeyboardcontroller.extensions.dp
import com.reactnativekeyboardcontroller.log.Logger
import com.reactnativekeyboardcontroller.traversal.FocusedInputHolder
import com.reactnativekeyboardcontroller.views.EdgeToEdgeViewRegistry
import com.reactnativekeyboardcontroller.views.background.getInputMethodColor
import com.reactnativekeyboardcontroller.views.overlay.JSPointerDispatcherCompat
import com.reactnativekeyboardcontroller.views.overlay.RootViewCompat
import java.lang.ref.WeakReference

private val TAG = CustomKeyboardHostView::class.qualifiedName
private const val TRANSITION_DURATION_MS = 250L

@SuppressLint("ViewConstructor")
class CustomKeyboardHostView(
  private val reactContext: ThemedReactContext,
) : ReactViewGroup(reactContext) {
  private val dispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, this.id)
  private var windowManager: WindowManager = reactContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager
  private var hostView: CustomKeyboardRootViewGroup = CustomKeyboardRootViewGroup(reactContext)
  private var takenOverInput: WeakReference<EditText?> = WeakReference(null)
  private var isHidingPanel = false

  var active: Boolean = false
    set(value) {
      field = value

      if (value) {
        FocusedInputHolder.get()?.let { takeOver(it) }
      } else {
        restoreSystemKeyboard()
      }
    }

  var stateWrapper: StateWrapper?
    get() = hostView.stateWrapper
    set(stateWrapper) {
      hostView.stateWrapper = stateWrapper
    }

  private val focusListener =
    ViewTreeObserver.OnGlobalFocusChangeListener { _, newFocus ->
      if (newFocus is EditText) {
        if (active) {
          takeOver(newFocus)
        } else {
          hidePanel()
        }
      } else if (newFocus == null) {
        hidePanel()
      }
    }

  private val contentLayoutListener =
    View.OnLayoutChangeListener { _, _, top, _, bottom, _, oldTop, _, oldBottom ->
      if (bottom - top != oldBottom - oldTop) {
        onContentHeightMayHaveChanged()
      }
    }

  init {
    hostView.eventDispatcher = dispatcher
  }

  // region life cycles
  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    viewTreeObserver.addOnGlobalFocusChangeListener(focusListener)
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()

    viewTreeObserver.removeOnGlobalFocusChangeListener(focusListener)
    restoreSystemKeyboard(showIme = false)
  }

  override fun addView(
    child: View?,
    index: Int,
  ) {
    UiThreadUtil.assertOnUiThread()
    child?.addOnLayoutChangeListener(contentLayoutListener)
    hostView.addView(child, index)
  }

  override fun getChildCount(): Int = hostView.childCount

  override fun getChildAt(index: Int): View? = hostView.getChildAt(index)

  override fun removeView(child: View?) {
    UiThreadUtil.assertOnUiThread()

    if (child != null) {
      child.removeOnLayoutChangeListener(contentLayoutListener)
      hostView.removeView(child)
    }
  }

  override fun removeViewAt(index: Int) {
    UiThreadUtil.assertOnUiThread()
    val child = getChildAt(index)
    child?.removeOnLayoutChangeListener(contentLayoutListener)
    hostView.removeView(child)
  }

  override fun onLayout(
    changed: Boolean,
    l: Int,
    t: Int,
    r: Int,
    b: Int,
  ) {

  }


  override fun addChildrenForAccessibility(outChildren: ArrayList<View>) {

  }


  override fun dispatchPopulateAccessibilityEvent(event: AccessibilityEvent): Boolean = false



  private fun takeOver(input: EditText) {
    val previousInput = takenOverInput.get()
    if (previousInput != null && previousInput !== input) {
      previousInput.showSoftInputOnFocus = true
    }


    input.showSoftInputOnFocus = false
    takenOverInput = WeakReference(input)

    suspendImeEvents(true)
    imm()?.hideSoftInputFromWindow(input.windowToken, 0)

    showPanel()
  }

  private fun restoreSystemKeyboard(showIme: Boolean = true) {
    val input = takenOverInput.get()
    takenOverInput = WeakReference(null)
    input?.showSoftInputOnFocus = true

    hidePanel {
      if (showIme && input != null && input.isFocused) {
        imm()?.showSoftInput(input, 0)
      }
    }
  }

  private fun imm(): InputMethodManager? =
    reactContext.currentActivity?.getSystemService(Context.INPUT_METHOD_SERVICE) as? InputMethodManager

  private fun contentHeight(): Int = hostView.getChildAt(0)?.height ?: 0

  private fun onContentHeightMayHaveChanged() {
    if (hostView.isAttached) {
      windowManager.updateViewLayout(hostView, createLayoutParams())
      emitKeyboardTransition()
    }
  }

  private fun createLayoutParams(): WindowManager.LayoutParams {
    val layoutParams =
      WindowManager.LayoutParams(
        WindowManager.LayoutParams.MATCH_PARENT,
        contentHeight().coerceAtLeast(1),
        WindowManager.LayoutParams.TYPE_APPLICATION_PANEL,
        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
        PixelFormat.TRANSLUCENT,
      )
    layoutParams.gravity = Gravity.BOTTOM

    return layoutParams
  }

  private fun showPanel() {
    if (hostView.isAttached) {
      if (isHidingPanel) {
        isHidingPanel = false
        hostView.animate().cancel()
        hostView
          .animate()
          .translationY(0f)
          .setDuration(TRANSITION_DURATION_MS)
          .setInterpolator(DecelerateInterpolator())
          .start()
        keyboardEventsCallback()?.animateSyntheticTransition(
          contentHeight().toFloat().dp,
          true,
          TRANSITION_DURATION_MS.toInt(),
        )
      }
      return
    }

    val height = contentHeight()

    hostView.translationY = height.toFloat()
    hostView.visibility = View.VISIBLE

    try {
      windowManager.addView(hostView, createLayoutParams())
    } catch (
      @Suppress("detekt:TooGenericExceptionCaught") e: RuntimeException,
    ) {
      Logger.w(TAG, "Can not show custom keyboard", e)
      return
    }

    hostView
      .animate()
      .translationY(0f)
      .setDuration(TRANSITION_DURATION_MS)
      .setInterpolator(DecelerateInterpolator())
      .start()

    keyboardEventsCallback()?.animateSyntheticTransition(
      height.toFloat().dp,
      true,
      TRANSITION_DURATION_MS.toInt(),
    )
  }

  private fun hidePanel(onHidden: (() -> Unit)? = null) {
    if (!hostView.isAttached) {
      onHidden?.invoke()
      return
    }

    isHidingPanel = true
    keyboardEventsCallback()?.animateSyntheticTransition(0.0, false, TRANSITION_DURATION_MS.toInt())

    hostView
      .animate()
      .translationY(contentHeight().toFloat())
      .setDuration(TRANSITION_DURATION_MS)
      .setInterpolator(DecelerateInterpolator())
      .withEndAction {
        if (!isHidingPanel) {
          return@withEndAction
        }
        isHidingPanel = false
        if (hostView.isAttached) {
          hostView.visibility = View.INVISIBLE
          windowManager.removeView(hostView)
        }
        suspendImeEvents(false)
        onHidden?.invoke()
      }.start()
  }

  private fun suspendImeEvents(suspended: Boolean) {
    keyboardEventsCallback()?.suspend(suspended)
  }

  private fun keyboardEventsCallback() = EdgeToEdgeViewRegistry.get()?.callback

  private fun emitKeyboardTransition() {
    val isShown = hostView.isAttached
    val height = if (isShown) contentHeight().toFloat().dp else 0.0

    keyboardEventsCallback()?.syncKeyboardPosition(height, isShown)
  }
}

@SuppressLint("ViewConstructor")
class CustomKeyboardRootViewGroup(
  private val reactContext: ThemedReactContext,
) : ReactViewGroup(reactContext),
  RootViewCompat {
  private val jsTouchDispatcher: JSTouchDispatcher = JSTouchDispatcher(this)
  private var jsPointerDispatcher: JSPointerDispatcherCompat? = null
  internal var eventDispatcher: EventDispatcher? = null
  internal var stateWrapper: StateWrapper? = null
  internal var isAttached = false

  init {
    if (ReactFeatureFlags.dispatchPointerEvents) {
      jsPointerDispatcher = JSPointerDispatcherCompat(this)
    }
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    isAttached = true
    setBackgroundColor(reactContext.getInputMethodColor())
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    isAttached = false
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    setBackgroundColor(reactContext.getInputMethodColor())
  }

  override fun onInterceptTouchEvent(event: MotionEvent): Boolean {
    eventDispatcher?.let { eventDispatcher ->
      try {
        jsTouchDispatcher.handleTouchEvent(event, eventDispatcher)
        jsPointerDispatcher?.handleMotionEventCompat(event, eventDispatcher, true)
      } catch (
        @Suppress("detekt:TooGenericExceptionCaught") e: RuntimeException,
      ) {
        Logger.w(TAG, "Can not handle touch event", e)
      }
    }
    return super.onInterceptTouchEvent(event)
  }

  @SuppressLint("ClickableViewAccessibility")
  override fun onTouchEvent(event: MotionEvent): Boolean {
    eventDispatcher?.let { eventDispatcher ->
      try {
        jsTouchDispatcher.handleTouchEvent(event, eventDispatcher)
        jsPointerDispatcher?.handleMotionEventCompat(event, eventDispatcher, false)
      } catch (
        @Suppress("detekt:TooGenericExceptionCaught") e: RuntimeException,
      ) {
        Logger.w(TAG, "Can not handle touch event", e)
      }
    }
    super.onTouchEvent(event)

    return true
  }

  override fun onInterceptHoverEvent(event: MotionEvent): Boolean {
    eventDispatcher?.let {
      jsPointerDispatcher?.handleMotionEventCompat(event, it, true)
    }
    return super.onInterceptHoverEvent(event)
  }

  override fun onHoverEvent(event: MotionEvent): Boolean {
    eventDispatcher?.let {
      jsPointerDispatcher?.handleMotionEventCompat(event, it, false)
    }
    return super.onHoverEvent(event)
  }

  override fun requestDisallowInterceptTouchEvent(disallowIntercept: Boolean) {
  }


  override fun onChildStartedNativeGesture(
    childView: View?,
    ev: MotionEvent,
  ) {
    eventDispatcher?.let { eventDispatcher ->
      jsTouchDispatcher.onChildStartedNativeGesture(ev, eventDispatcher)
      jsPointerDispatcher?.onChildStartedNativeGesture(childView, ev, eventDispatcher)
    }
  }

  override fun onChildEndedNativeGesture(
    childView: View,
    ev: MotionEvent,
  ) {
    eventDispatcher?.let { jsTouchDispatcher.onChildEndedNativeGesture(ev, it) }
    jsPointerDispatcher?.onChildEndedNativeGesture()
  }

  override fun handleException(t: Throwable) {
    reactContext.reactApplicationContext.handleException(RuntimeException(t))
  }
}
