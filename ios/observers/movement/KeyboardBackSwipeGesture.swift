import UIKit

/// Dismisses the keyboard before the navigator starts an accepted interactive pop.
final class KeyboardBackSwipeGesture: NSObject {
  static let shared = KeyboardBackSwipeGesture()

  private var enabled = false
  private var mounts = 0
  private var keyboardVisible = false
  private weak var navigation: UINavigationController?
  private var delegates: [BackSwipeGestureDelegate] = []
  private var restoration: FocusRestoration?

  override private init() {
    super.init()
  }

  func mount() {
    mounts += 1
    refresh()
  }

  func unmount() {
    mounts = max(0, mounts - 1)
    if mounts == 0 {
      detach()
      keyboardVisible = false
    }
  }

  func setEnabled(_ enabled: Bool) {
    self.enabled = enabled
    refresh()
  }

  func keyboardWillChange(visible: Bool) {
    keyboardVisible = visible
    if visible {
      refresh()
    }
  }

  func refresh() {
    guard enabled, mounts > 0 else {
      detach()
      return
    }
    // A disappearing input temporarily has no navigation controller. Keep the
    // accepted gesture's completion handler until its transition has finished.
    guard restoration == nil else { return }
    guard let input = UIResponder.current as? TextInput,
          let navigation = input.parentViewController?.navigationController,
          let screen = navigation.topViewController,
          input.isDescendant(of: screen.view)
    else {
      detach()
      return
    }

    let gestures = backGestures(in: navigation)
    if self.navigation === navigation,
       gestures.count == delegates.count,
       gestures.allSatisfy({ gesture in delegates.contains { $0.gesture === gesture && gesture.delegate === $0 } })
    {
      return
    }
    detach()
    self.navigation = navigation
    delegates = gestures.map { gesture in
      let delegate = BackSwipeGestureDelegate(gesture: gesture, owner: self)
      gesture.delegate = delegate
      gesture.addTarget(self, action: #selector(gestureChanged(_:)))
      return delegate
    }
  }

  private func backGestures(in navigation: UINavigationController) -> [UIGestureRecognizer] {
    var gestures = [navigation.interactivePopGestureRecognizer].compactMap { $0 }
    #if compiler(>=6.2)
      if #available(iOS 26.0, *), let content = navigation.interactiveContentPopGestureRecognizer {
        gestures.append(content)
      }
    #endif

    // Match custom pans on the navigation container by their existing pop
    // delegate, without depending on react-native-screens classes.
    let popDelegate = (gestures.first?.delegate as? BackSwipeGestureDelegate)?.original
      ?? gestures.first?.delegate
    if let popDelegate {
      for gesture in navigation.view.superview?.gestureRecognizers ?? [] {
        let delegate = (gesture.delegate as? BackSwipeGestureDelegate)?.original ?? gesture.delegate
        if gesture is UIPanGestureRecognizer, delegate === popDelegate,
           !gestures.contains(where: { $0 === gesture })
        {
          gestures.append(gesture)
        }
      }
    }
    return gestures
  }

  fileprivate func accepted(_ gesture: UIGestureRecognizer) {
    guard enabled, mounts > 0, keyboardVisible, restoration == nil,
          let navigation, navigation.viewControllers.count > 1,
          navigation.transitionCoordinator == nil,
          let screen = navigation.topViewController,
          let input = UIResponder.current as? TextInput,
          input.isDescendant(of: screen.view)
    else { return }

    let restoration = FocusRestoration(input: input, screen: screen, navigation: navigation)
    self.restoration = restoration

    // Our interactive-keyboard accessory normally defers resign by one frame.
    // Remove it first so this resign completes before the navigator starts pop.
    if input.inputAccessoryView is InvisibleInputAccessoryView {
      KeyboardAreaExtender.shared.hide()
      input.inputAccessoryView = nil
      KeyboardAreaExtender.shared.remove()
      NotificationCenter.default.post(
        name: .shouldIgnoreKeyboardEvents, object: nil, userInfo: ["ignore": false]
      )
    }
    KeyboardControllerModuleImpl.dismiss(false, animated: true)
    guard !input.isFirstResponder else {
      self.restoration = nil
      return
    }
    if let fallback = UIResponder.current as? UIView,
       !(fallback is TextInput), input.isDescendant(of: fallback)
    {
      restoration.fallbackResponder = fallback
    }
    // Read the coordinator after every gesture target has had a chance to start pop.
    DispatchQueue.main.async { [weak self] in
      self?.observeTransition(for: gesture, restoration: restoration)
    }
  }

  @objc private func gestureChanged(_ gesture: UIGestureRecognizer) {
    guard let restoration else { return }
    DispatchQueue.main.async { [weak self] in
      self?.observeTransition(for: gesture, restoration: restoration)
    }
  }

  private func observeTransition(for gesture: UIGestureRecognizer, restoration: FocusRestoration) {
    guard self.restoration === restoration, !restoration.observing else { return }
    if let coordinator = restoration.navigation?.transitionCoordinator,
       coordinator.initiallyInteractive,
       coordinator.viewController(forKey: .from) === restoration.screen
    {
      restoration.observing = true
      coordinator.animate(alongsideTransition: nil) { [weak self] context in
        let cancelled = context.isCancelled
        // Leave UIKit's completion transaction before asking it to show again.
        DispatchQueue.main.async {
          self?.finish(restoration, cancelled: cancelled)
        }
      }
    } else if gesture.state != .began, gesture.state != .changed {
      // Another recognizer may prevent recognition after shouldBegin accepted.
      finish(restoration, cancelled: true)
    }
  }

  private func finish(_ restoration: FocusRestoration, cancelled: Bool) {
    guard self.restoration === restoration else { return }
    self.restoration = nil
    let responder = UIResponder.current
    guard cancelled, enabled, mounts > 0,
          let screen = restoration.screen,
          restoration.navigation?.topViewController === screen,
          screen.presentedViewController == nil,
          let input = restoration.input, input.window?.isKeyWindow == true,
          FocusedInputHolder.shared.get() === input,
          responder == nil || responder === restoration.fallbackResponder
    else { return }
    FocusedInputHolder.shared.focus()
  }

  private func detach() {
    restoration = nil
    for delegate in delegates {
      guard let gesture = delegate.gesture else { continue }
      gesture.removeTarget(self, action: #selector(gestureChanged(_:)))
      // A navigator can replace its delegate while this policy is active.
      if gesture.delegate === delegate {
        gesture.delegate = delegate.original
      }
    }
    delegates.removeAll()
    navigation = nil
  }
}

private final class FocusRestoration {
  weak var input: TextInput?
  // React Native's root view can become first responder when a text input resigns.
  weak var fallbackResponder: UIResponder?
  weak var screen: UIViewController?
  weak var navigation: UINavigationController?
  var observing = false

  init(input: TextInput, screen: UIViewController, navigation: UINavigationController) {
    self.input = input
    self.screen = screen
    self.navigation = navigation
  }
}

/// Forwards every optional delegate method, including failure and simultaneous
/// recognition rules, while observing the existing shouldBegin decision.
private final class BackSwipeGestureDelegate: NSObject, UIGestureRecognizerDelegate {
  weak var gesture: UIGestureRecognizer?
  weak var original: UIGestureRecognizerDelegate?
  private weak var owner: KeyboardBackSwipeGesture?

  init(gesture: UIGestureRecognizer, owner: KeyboardBackSwipeGesture) {
    self.gesture = gesture
    original = gesture.delegate
    self.owner = owner
    super.init()
  }

  func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
    let accepted = original?.gestureRecognizerShouldBegin?(gestureRecognizer) ?? true
    if accepted {
      owner?.accepted(gestureRecognizer)
    }
    return accepted
  }

  override func responds(to selector: Selector!) -> Bool {
    super.responds(to: selector) || (original?.responds(to: selector) ?? false)
  }

  override func forwardingTarget(for selector: Selector!) -> Any? {
    if original?.responds(to: selector) == true {
      return original
    }
    return super.forwardingTarget(for: selector)
  }
}
