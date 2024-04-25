package com.facebook.react.views.textinput

import android.os.Build
import android.view.ViewTreeObserver
import com.reactnativekeyboardcontroller.extensions.dp
import kotlin.math.max
import kotlin.math.min

// TODO: reduce complexity
class KeyboardControllerSelectionWatcher(
  private val editText: ReactEditText,
  originalHandler: Any?,
  private val action: (start: Int, end: Int, startX: Double, startY: Double, endX: Double, endY: Double) -> Unit
) : SelectionWatcher {
  private var lastSelectionStart: Int = -1
  private var lastSelectionEnd: Int = -1

  private val selectionWatcher: SelectionWatcher? = originalHandler as? SelectionWatcher

  override fun onSelectionChanged(start: Int, end: Int) {
    if (lastSelectionStart != start || lastSelectionEnd != end) {
      lastSelectionStart = start
      lastSelectionEnd = end

      val view = editText
      val layout = view.layout

      if (layout === null) {
        view.viewTreeObserver.addOnGlobalLayoutListener(object : ViewTreeObserver.OnGlobalLayoutListener {
          override fun onGlobalLayout() {
            view.viewTreeObserver.removeOnGlobalLayoutListener(this)
            onSelectionChanged(start, end)
          }
        })

        return
      }

      var cursorPositionStartX = 0.0
      var cursorPositionStartY = 0.0
      var cursorPositionEndX = 0.0
      var cursorPositionEndY = 0.0

      val realStart = min(start, end)
      val realEnd = max(start, end)

      val lineStart = layout.getLineForOffset(realStart)
      val baselineStart = layout.getLineBaseline(lineStart)
      val ascentStart = layout.getLineAscent(lineStart)

      cursorPositionStartX = layout.getPrimaryHorizontal(realStart).dp
      cursorPositionStartY = (baselineStart + ascentStart).toFloat().dp

      val lineEnd = layout.getLineForOffset(realEnd)
      // TODO: remove unused variables
      val baselineEnd = layout.getLineBaseline(lineEnd)
      val ascentEnd = layout.getLineAscent(lineEnd)

      val right = layout.getPrimaryHorizontal(realEnd)
      val bottom = layout.getLineBottom(lineEnd) + layout.getLineAscent(lineEnd)
      val cursorWidth = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        view.textCursorDrawable?.intrinsicWidth ?: 0
      } else {
        0
      }

      cursorPositionEndX = (right + cursorWidth).dp
      cursorPositionEndY = bottom.toFloat().dp

      action(start, end, cursorPositionStartX, cursorPositionStartY, cursorPositionEndX, cursorPositionEndY)
    }

    selectionWatcher?.onSelectionChanged(start, end)
  }

  fun setCustomSelectionWatcher() {
    editText.setSelectionWatcher(this)
  }

  fun setOriginalHandler() {
    editText.setSelectionWatcher(selectionWatcher)
  }
}
