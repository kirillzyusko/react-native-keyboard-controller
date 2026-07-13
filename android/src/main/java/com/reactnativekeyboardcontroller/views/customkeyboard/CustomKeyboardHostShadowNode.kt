package com.reactnativekeyboardcontroller.views.customkeyboard

import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ReactShadowNodeImpl
import com.facebook.yoga.YogaPositionType
import com.reactnativekeyboardcontroller.extensions.getDisplaySize

internal class CustomKeyboardHostShadowNode : LayoutShadowNode() {
  init {
    // Maybe we should do it directly in Component itself with style: absolute, instead YogaPositionSet
    setPositionType(YogaPositionType.ABSOLUTE)
  }

  override fun addChildAt(
    child: ReactShadowNodeImpl,
    i: Int,
  ) {
    super.addChildAt(child, i)

    @Suppress("UsePropertyAccessSyntax")
    val displaySize = getThemedContext().getDisplaySize()
    child.setStyleWidth(displaySize.x.toFloat())
  }
}
