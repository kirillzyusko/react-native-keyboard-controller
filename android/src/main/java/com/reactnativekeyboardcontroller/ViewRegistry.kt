package com.reactnativekeyboardcontroller

import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup

object ViewRegistry {
  var provider: ReactViewGroup? = null
  val hashMap: HashMap<Int, ReactContext> = HashMap()

  fun add(viewId: Int, context: ReactContext) {
    hashMap[viewId] = context
  }

  fun remove(viewId: Int) {
    hashMap.remove(viewId)
  }
}
