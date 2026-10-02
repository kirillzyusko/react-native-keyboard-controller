//
//  KeyboardMovementObserver+Watcher.swift
//  Pods
//
//  Created by Kiryl Ziusko on 07/08/2025.
//

extension KeyboardMovementObserver {
  @objc func setupKeyboardWatcher() {
    // sometimes `will` events can be called multiple times.
    // To avoid double re-creation of listener we are adding this condition
    // (if active link is present, then no need to re-setup a listener)
    if !displayLink.isPaused {
      return
    }

    displayLink.isPaused = false
  }

  @objc func removeKeyboardWatcher() {
    displayLink.isPaused = true
  }

  @objc func updateKeyboardFrame(link: CADisplayLink) {
    if keyboardTrackingView.view == nil {
      return
    }

    let (visibleKeyboardHeight, keyboardFrameY) = keyboardTrackingView.view.frameTransitionInWindow
    var keyboardPosition = visibleKeyboardHeight - KeyboardAreaExtender.shared.offset

    // The keyboard layer is not always animated: on a scroll-driven dismissal
    // the `keyboardLayoutGuide` constraint is sometimes applied instantly, and
    // the presentation layer then reports its FINAL position on the very first
    // tick. Sampling cannot describe the travel in that case, so drive the
    // progression from the duration iOS announced instead.
    //
    // `transitionFrom != target` skips the degenerate case: iOS can post
    // `keyboardWillHide` twice, and the second one announces a hide from a
    // keyboard that is already down -- no travel to describe.
    let isLayerAnimating =
      !((keyboardTrackingView.view?.layer.presentation()?.animationKeys() ?? []).isEmpty)

    if !isLayerAnimating, let target = transitionTarget, transitionFrom != target {
      let elapsed = min(
        max((CACurrentMediaTime() - transitionStart) / transitionDuration, 0),
        1
      )
      // easeOutQuart, fitted against the sampled trajectory of a healthy hide
      // on iOS 26.5 (rms 0.038 across the 383ms travel). The system curve is a
      // spring that covers half its distance within the first ~19% of the
      // reported duration, so any ease-in start lags visibly. The residual is
      // confined to the first ~40ms, where the real spring ramps up from zero
      // velocity while this curve starts immediately.
      let remaining = 1 - elapsed
      let eased = 1 - remaining * remaining * remaining * remaining
      let position = transitionFrom + (target - transitionFrom) * eased

      if elapsed >= 1 {
        // Travel is over: release the transition so this branch stops taking
        // priority. Otherwise it keeps re-emitting the final value on every
        // display-link tick for as long as the link runs -- indefinitely
        // whenever the `did` event has been cancelled.
        transitionTarget = nil
      }

      prevKeyboardPosition = position

      onEvent(
        "onKeyboardMove",
        position as NSNumber,
        position / CGFloat(keyboardHeight) as NSNumber,
        duration as NSNumber,
        tag
      )

      return
    }

    if keyboardPosition == prevKeyboardPosition || keyboardFrameY == 0 {
      return
    }

    if animation == nil {
      initializeAnimation(fromValue: prevKeyboardPosition, toValue: transitionTarget ?? keyboardHeight)
    }

    prevKeyboardPosition = keyboardPosition

    if let animation = animation {
      if animation.isFinished {
        return
      }
      let baseDuration = animation.timingAt(value: keyboardPosition)

      #if targetEnvironment(simulator)
        // on iOS simulator we can not use static interval
        // (from my observation from frame to frame we may have different delays)
        // so for now we use approximation - we add a difference as
        // beginTime - keyboardEventTime (but only in 0..0.016 range)
        // and it gives satisfactory results (better than static delays)
        let duration = baseDuration + animation.diff
      #else
        // 2 frames because we read previous frame, but need to calculate the next frame
        let duration = baseDuration + link.duration * 2
      #endif

      let position = CGFloat(animation.valueAt(time: duration))
      // handles a case when final frame has final destination (i. e. 0 or 291)
      // but CASpringAnimation can never get to this final destination
      let race: (CGFloat, CGFloat) -> CGFloat = animation.isIncreasing ? max : min
      keyboardPosition = race(position, keyboardPosition)
      animation.lastValue = keyboardPosition
    }

    onEvent(
      "onKeyboardMove",
      keyboardPosition as NSNumber,
      keyboardPosition / CGFloat(keyboardHeight) as NSNumber,
      duration as NSNumber,
      tag
    )
  }
}
