package com.reactnativekeyboardcontroller.extensions

import android.view.View
import android.view.ViewGroup
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType
import com.facebook.react.uimanager.events.EventDispatcher
import com.reactnativekeyboardcontroller.BuildConfig

private val archType = if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) UIManagerType.FABRIC else UIManagerType.DEFAULT

val ReactContext.uiManager
  get() = UIManagerHelper.getUIManager(this, archType)

val ReactContext.eventDispatcher: EventDispatcher?
  get() = UIManagerHelper.getEventDispatcher(this, archType)

val ReactContext.rootView: View?
  get() =
    this.currentActivity
      ?.window
      ?.decorView
      ?.rootView

val ReactContext.content: ViewGroup?
  get() =
    this.currentActivity?.window?.decorView?.rootView?.findViewById(
      androidx.appcompat.R.id.action_bar_root,
    )
