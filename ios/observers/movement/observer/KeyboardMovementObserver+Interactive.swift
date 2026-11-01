//
//  KeyboardMovementObserver+Interactive.swift
//  Pods
//
//  Created by Kiryl Ziusko on 07/08/2025.
//

extension KeyboardMovementObserver {
  func setupKVObserver() {
    guard interactiveKeyboardObserver == nil, let view = keyboardTrackingView.view else { return }

    interactiveKeyboardObserver = view.observe(\.center, options: .new) { [weak self] _, change in
      guard let self = self, let changeValue = change.newValue else { return }

      self.keyboardDidMoveInteractively(changeValue: changeValue)
    }
  }

  func removeKVObserver() {
    interactiveKeyboardObserver?.invalidate()
    interactiveKeyboardObserver = nil
  }

  private func keyboardDidMoveInteractively(changeValue: CGPoint) {
    if UIResponder.isKeyboardPreloading {
      return
    }

    if KeyboardEventsIgnorer.shared.shouldIgnore {
      return
    }

    let position = keyboardTrackingView.interactive(point: changeValue)

    if position == KeyboardTrackingView.invalidPosition {
      return
    }

    if position == 0 {
      // it will be triggered before `keyboardWillDisappear` and
      // we don't need to trigger `onInteractive` handler for that
      // since it will be handled in `keyboardWillDisappear` function
      return
    }

    if !displayLink.isPaused {
      // UIKit switched from the opening animation to interactive movement.
      // Stop the display-link stream before emitting the observed position so
      // only one tracker remains authoritative.
      removeKeyboardWatcher()
      onCancelAnimation()
      animation = nil
    }

    prevKeyboardPosition = position

    keyboardDidTask?.cancel()

    onEvent(
      "onKeyboardMoveInteractive",
      position as NSNumber,
      position / CGFloat(keyboardHeight) as NSNumber,
      -1,
      tag
    )
  }
}
