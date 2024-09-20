package com.reactnativekeyboardcontroller.views.overlay

import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ReactShadowNodeImpl
import com.reactnativekeyboardcontroller.extensions.getDisplaySize

/**
 * We implement the OverKeyboardView by using an Android WindowManager. That will fill the entire window of the
 * application. To get layout to work properly, we need to layout all the elements within the
 * OverKeyboardView's inner content view as if they can fill the entire window. To do that, we need to
 * explicitly set the styleWidth and styleHeight on the LayoutShadowNode of the child of this node
 * to be the window size. This will then cause the children of the Modal to layout as if they can
 * fill the window.
 */
internal class OverKeyboardHostShadowNode : LayoutShadowNode() {
  /**
   * We need to set the styleWidth and styleHeight of the one child (represented by the
   * <View></View> within the <RCTOverKeyboardView></RCTOverKeyboardView> in OverKeyboardView.tsx.
   * This needs to fill the entire window.
   */
  override fun addChildAt(child: ReactShadowNodeImpl, i: Int) {
    super.addChildAt(child, i)
    val modalSize = themedContext.getDisplaySize()
    child.setStyleWidth(modalSize.x.toFloat())
    child.setStyleHeight(modalSize.y.toFloat())
  }
}
