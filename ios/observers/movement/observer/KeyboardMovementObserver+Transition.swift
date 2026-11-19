//
//  KeyboardMovementObserver+Transition.swift
//  Pods
//
//  Created by Kiryl Ziusko on 18/11/2026.
//

/// The way an interactive transition (i. e. "swipe back" gesture) moves the keyboard.
enum KeyboardTransition {
  /// System transition: the keyboard moves horizontally, together with its screen.
  case withScreen
  /// Custom transition: the keyboard moves vertically as the transition progresses.
  case withGesture
}

/// When a screen with an opened keyboard is swiped back, UIKit moves the keyboard as a part of the
/// transition: `keyboardWillHide` is posted as soon as the gesture starts, but the keyboard is gone only
/// when the transition is finished (and it comes back if the gesture is cancelled).
extension KeyboardMovementObserver {
  /// All notifications that are posted during the transition describe the transition, not the keyboard.
  var isKeyboardInTransition: Bool {
    return transitionCoordinator != nil
  }

  /// `true` if the screen of the focused input is being moved by a gesture. UIKit rearranges the keyboard
  /// before it announces what is going on, so the position of the keyboard tells nothing at this moment.
  var isScreenInTransition: Bool {
    return FocusedInputHolder.shared.get()?.viewController?.transitionCoordinator?.isInteractive == true
  }

  /// Returns an interactive transition that moves the keyboard at the moment (if any).
  func keyboardTransition(
    for notification: Notification
  ) -> (kind: KeyboardTransition, coordinator: UIViewControllerTransitionCoordinator)? {
    let (duration, _) = notification.keyboardMetaData()

    guard
      let input = FocusedInputHolder.shared.get(),
      let coordinator = input.viewController?.transitionCoordinator,
      coordinator.isInteractive
    else { return nil }

    // the keyboard is animated by the transition (and not dismissed by someone during the transition)
    let isAnimated = abs(coordinator.transitionDuration * 1000 - Double(duration)) < 1
    // a keyboard with an input accessory view is moved by the transition too, but it's announced without
    // animation (and the input keeps the focus, so UIKit can bring the keyboard back)
    let isMoved = duration == 0 && input.isFirstResponder

    guard isAnimated || isMoved else { return nil }

    return (coordinator.isSystemPop ? .withScreen : .withGesture, coordinator)
  }

  /// Starts tracking of an interactive transition that hides the keyboard.
  ///
  /// - Returns: `nil` if the keyboard is hidden in a regular way.
  func beginTransition(hidingKeyboardWith notification: Notification) -> KeyboardTransition? {
    guard let (transition, coordinator) = keyboardTransition(for: notification) else { return nil }
    let shown = self.notification

    let isTracked = coordinator.animate(alongsideTransition: nil) { [weak self] context in
      guard let self = self, self.isKeyboardInTransition else { return }
      let announced = self.transitionNotification
      self.endTransition()

      UIView.performWithoutAnimation {
        if context.isCancelled {
          self.cancelTransition(transition, hiddenBy: notification, shownBy: announced ?? shown)
        } else {
          self.finishTransition(transition, hiddenBy: notification, shownBy: announced)
        }
      }
    }

    guard isTracked else { return nil }

    transitionCoordinator = coordinator
    self.transition = transition
    if transition == .withGesture {
      trackKeyboard(in: coordinator.containerView)
    }

    return transition
  }

  /// The screen is gone together with its keyboard, but the revealed screen can bring its own one.
  private func finishTransition(
    _ transition: KeyboardTransition, hiddenBy hidden: Notification, shownBy arrived: Notification?
  ) {
    if let arrived = arrived {
      dispatchWillAppear(arrived.withoutAnimation)
      restoredKeyboard = (tag, keyboardHeight)
    } else if transition == .withScreen {
      keyboardWillDisappear(hidden.withoutAnimation)
    } else {
      keyboardDidDisappear(hidden)
    }
  }

  /// The screen is back, and so is its keyboard if the input has the focus.
  private func cancelTransition(
    _ transition: KeyboardTransition, hiddenBy hidden: Notification, shownBy returned: Notification?
  ) {
    guard UIResponder.current is TextInput else {
      return finishTransition(transition, hiddenBy: hidden, shownBy: nil)
    }

    // the keyboard that travelled with its screen is where it was, and nobody was told that it had moved.
    // The keyboard that went down is announced again: it can differ from the one that was hidden (i. e. it
    // has no accessory view anymore)
    if transition == .withGesture, let returned = returned, returned.name == UIResponder.keyboardWillShowNotification {
      dispatchWillAppear(returned.withoutAnimation)
    }

    restoredKeyboard = (tag, keyboardHeight)
  }

  func endTransition() {
    transitionCoordinator = nil
    transition = nil
    transitionNotification = nil
    transitionTrackingView?.removeFromSuperview()
    transitionTrackingView = nil
    animation = nil
  }

  /// A custom transition doesn't bring the keyboard of the revealed screen: UIKit shows this keyboard with
  /// a regular animation when the screen has arrived, so the notification has to be handled when it's posted
  /// (inside the animation of the keyboard), and not when the transition is finished.
  func isAnimatedByItself(_ notification: Notification) -> Bool {
    return transition == .withGesture && notification.keyboardMetaData().0 > 0
  }

  /// A transition puts a keyboard on the screen when the revealed screen brings its own one, or when the
  /// gesture is cancelled and the keyboard comes back. UIKit announces such a keyboard more than once, but
  /// only the first announcement is dispatched: the others don't bring anything new, and a repeated event
  /// moves the views that count their position from the previous one.
  ///
  /// - Returns: `true` if the keyboard described by `tag` and `keyboardHeight` has been dispatched already.
  func isKeyboardRestored() -> Bool {
    let isRestored = restoredKeyboard?.tag == tag && restoredKeyboard?.height == keyboardHeight

    if !isRestored {
      restoredKeyboard = nil
    }

    return isRestored
  }

  /// Dispatches a position of the keyboard that is moved by the transition.
  func updateKeyboardFrameInTransition() {
    guard
      let view = transitionTrackingView,
      let position = view.layer.presentation()?.frame.origin.y,
      position != prevKeyboardPosition
    else { return }

    prevKeyboardPosition = position

    // `keyboardHeight` changes during the transition if the input loses its accessory view
    let progress = position / view.frame.height

    onEvent("onKeyboardMove", position as NSNumber, progress as NSNumber, duration as NSNumber, tag)
  }

  /// The keyboard can't tell where it is while the transition moves it. However, every change that is made
  /// when the transition begins is animated exactly like the keyboard, so we move an invisible view along
  /// (its height keeps the height that the keyboard had before the transition).
  private func trackKeyboard(in container: UIView) {
    let view = UIView(frame: CGRect(x: 0, y: keyboardHeight, width: 0, height: keyboardHeight))
    view.isHidden = true

    UIView.performWithoutAnimation { container.addSubview(view) }
    view.frame.origin.y = 0

    // a view that is moved without animation is already at the end and tells nothing about the keyboard
    if view.layer.animationKeys()?.isEmpty == false {
      transitionTrackingView = view
    } else {
      view.removeFromSuperview()
    }
  }
}

private extension UIViewControllerTransitionCoordinatorContext {
  /// `true` if the screen is being swiped back by a system gesture.
  var isSystemPop: Bool {
    let recognizers = viewController(forKey: .to)?.navigationController?.swipeBackGestureRecognizers ?? []

    return recognizers.contains { $0.state == .began || $0.state == .changed }
  }
}
