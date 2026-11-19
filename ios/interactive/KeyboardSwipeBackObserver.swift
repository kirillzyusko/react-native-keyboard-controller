//
//  KeyboardSwipeBackObserver.swift
//  Pods
//
//  Created by Kiryl Ziusko on 18/11/2026.
//

/// `react-native-screens` can dismiss the keyboard when a screen is swiped back (`hideKeyboardOnSwipe`), but
/// it does that when the transition is already running. In this case UIKit remembers that the keyboard was
/// visible and puts it back without animation if the gesture gets cancelled.
///
/// To have regular animations in both directions we dismiss the keyboard right before the transition
/// (when the gesture is recognized) and return the focus if the transition gets cancelled.
final class KeyboardSwipeBackObserver {
  static let shared = KeyboardSwipeBackObserver()

  private var observations = [NSKeyValueObservation]()
  /// The gesture that has dismissed the keyboard, but hasn't started the transition yet.
  private weak var pendingRecognizer: UIGestureRecognizer?

  private init() {}

  /// Starts to observe "swipe back" gestures of the screens that contain `input`.
  func observe(_ input: UIView) {
    let navigationControllers = sequence(first: input as UIResponder, next: { $0.next })
      .compactMap { $0 as? UINavigationController }

    pendingRecognizer = nil
    observations = navigationControllers.flatMap { navigationController in
      let recognizers = navigationController.swipeBackGestureRecognizers
        + navigationController.customSwipeBackGestureRecognizers

      return recognizers.map { recognizer in
        recognizer.observe(\.state) { [weak input, weak navigationController] recognizer, _ in
          guard let input = input, let navigationController = navigationController else { return }

          if recognizer.state == .began {
            self.dismissKeyboard(of: input, by: recognizer, in: navigationController)
          } else if recognizer === self.pendingRecognizer {
            self.returnKeyboard(to: input, after: recognizer, in: navigationController)
          }
        }
      }
    }
  }

  private func dismissKeyboard(
    of input: UIView, by recognizer: UIGestureRecognizer, in navigationController: UINavigationController
  ) {
    guard
      input.isFirstResponder,
      let screen = navigationController.topViewController?.viewIfLoaded,
      input.isDescendant(of: screen),
      screen.value(forKeyIfExists: "hideKeyboardOnSwipe") as? Bool == true
    else { return }

    if resign(input) {
      pendingRecognizer = recognizer
    }
  }

  /// The keyboard has to be gone before the transition begins, but an input with the accessory view is
  /// resigned with a delay. So this view is removed here, and since the removal moves the keyboard, the
  /// position of the keyboard is ignored in the meantime (it's not an interactive dismissal).
  private func resign(_ input: UIView) -> Bool {
    guard KeyboardAreaExtender.shared.detach(from: input) else {
      return input.resignFirstResponder()
    }

    KeyboardEventsIgnorer.shared.shouldIgnoreKeyboardEvents = true
    defer { KeyboardEventsIgnorer.shared.shouldIgnoreKeyboardEvents = false }

    return input.resignFirstResponder()
  }

  /// A recognized gesture starts the transition, but not necessarily at once. The focus has to be returned
  /// if this transition gets cancelled (or if the gesture is over and the transition hasn't been started).
  private func returnKeyboard(
    to input: UIView, after recognizer: UIGestureRecognizer, in navigationController: UINavigationController
  ) {
    let focus = { [weak input] in
      // nobody else has taken the focus
      if !(UIResponder.current is TextInput) {
        input?.becomeFirstResponder()
      }
    }

    if let coordinator = navigationController.transitionCoordinator {
      pendingRecognizer = nil
      coordinator.animate(alongsideTransition: nil) { context in
        if context.isCancelled {
          focus()
        }
      }
    } else if recognizer.state != .changed {
      pendingRecognizer = nil
      DispatchQueue.main.async(execute: focus)
    }
  }
}
