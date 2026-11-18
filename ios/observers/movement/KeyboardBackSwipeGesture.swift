import UIKit

/// Applies keyboard policies to the navigator's accepted native back gestures.
final class KeyboardBackSwipeGesture: NSObject {
  static let shared = KeyboardBackSwipeGesture()

  private var mode: KeyboardBackSwipeTransition.Mode?
  private var mounts = 0
  private var keyboardVisible = false
  private weak var navigation: UINavigationController?
  private var delegates: [BackSwipeGestureDelegate] = []
  private var restoration: FocusRestoration?
  private var nativeGesture: NativeBackSwipeGesture?

  private var needsNativeGesture: Bool {
    if #available(iOS 26.0, *) {
      return false
    }
    return mode == KeyboardBackSwipeTransition.Mode.none
  }

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

  func setMode(_ mode: KeyboardBackSwipeTransition.Mode?) {
    if self.mode != mode {
      detach()
    }
    self.mode = mode
    refresh()
  }

  func keyboardWillChange(visible: Bool) {
    keyboardVisible = visible
    if visible {
      refresh()
    }
  }

  func refresh() {
    guard mode == .close || needsNativeGesture, mounts > 0 else {
      detach()
      return
    }
    // A disappearing input temporarily has no navigation controller. Keep the
    // accepted gesture's completion handler until its transition has finished.
    guard restoration == nil else { return }
    if nativeGesture?.navigation?.transitionCoordinator != nil {
      return
    }
    guard let input = UIResponder.current as? TextInput,
          let navigation = input.parentViewController?.navigationController,
          let screen = navigation.topViewController,
          input.isDescendant(of: screen.view)
    else {
      detach()
      return
    }

    if needsNativeGesture {
      if nativeGesture?.navigation === navigation, nativeGesture?.isAttached == true {
        return
      }
      if let coordinator = navigation.transitionCoordinator {
        coordinator.animate(alongsideTransition: nil) { [weak self] _ in
          DispatchQueue.main.async { self?.refresh() }
        }
        return
      }
      detach()
      self.navigation = navigation
      nativeGesture = NativeBackSwipeGesture(navigation: navigation)
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
    guard mode == .close, mounts > 0, keyboardVisible, restoration == nil,
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
    guard cancelled, mode == .close, mounts > 0,
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
    nativeGesture?.detach()
    nativeGesture = nil
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

/// Before iOS 26, native-stack's full-screen pan selects a custom animator.
/// UIKit then dismisses the keyboard vertically. Use its existing native pop
/// driver so the real keyboard stays associated with the outgoing screen.
private final class NativeBackSwipeGesture: NSObject, UIGestureRecognizerDelegate {
  weak var navigation: UINavigationController?
  private weak var edge: UIGestureRecognizer?
  private weak var sourcePan: UIPanGestureRecognizer?
  private weak var sourceDelegate: UIGestureRecognizerDelegate?
  private let pan: UIPanGestureRecognizer
  private let sourceEnabled: Bool

  var isAttached: Bool {
    guard let navigation, let screen = navigation.topViewController?.viewIfLoaded else { return false }
    return pan.view === navigation.view && sourcePan?.delegate === sourceDelegate
      && (screen.safeValue(forKey: "stackAnimation") as? NSNumber)?.intValue == 0
      && (screen.safeValue(forKey: "swipeDirection") as? NSNumber)?.intValue == 0
  }

  init?(navigation: UINavigationController) {
    guard navigation.viewControllers.count > 1,
          navigation.transitionCoordinator == nil,
          let screen = navigation.topViewController?.viewIfLoaded,
          (screen.safeValue(forKey: "stackAnimation") as? NSNumber)?.intValue == 0,
          (screen.safeValue(forKey: "swipeDirection") as? NSNumber)?.intValue == 0,
          let edge = navigation.interactivePopGestureRecognizer,
          let delegate = edge.delegate,
          let source = navigation.view.superview?.gestureRecognizers?.first(where: {
            $0 is UIPanGestureRecognizer && !($0 is UIScreenEdgePanGestureRecognizer) && $0.delegate === delegate
          }) as? UIPanGestureRecognizer,
          let targets = edge.safeValue(forKey: "targets") as? [NSObject]
    else { return nil }

    // Before iOS 26, reuse UIKit's undocumented full-screen pop entry point.
    let action = NSSelectorFromString("handleNavigationTransition:")
    guard let target = targets.compactMap({ $0.safeValue(forKey: "target") as? NSObject })
      .first(where: { $0.responds(to: action) })
    else { return nil }

    self.navigation = navigation
    self.edge = edge
    sourcePan = source
    sourceDelegate = delegate
    sourceEnabled = source.isEnabled
    pan = UIPanGestureRecognizer(target: target, action: action)
    super.init()
    pan.maximumNumberOfTouches = 1
    pan.delegate = self
    source.isEnabled = false
    navigation.view.addGestureRecognizer(pan)
  }

  func detach() {
    pan.view?.removeGestureRecognizer(pan)
    if sourcePan?.isEnabled == false {
      sourcePan?.isEnabled = sourceEnabled
    }
    pan.delegate = nil
  }

  func gestureRecognizerShouldBegin(_: UIGestureRecognizer) -> Bool {
    guard let navigation, navigation.viewControllers.count > 1,
          navigation.transitionCoordinator == nil,
          let edge, edge.isEnabled,
          let sourceView = sourcePan?.view
    else { return false }

    let translation = pan.translation(in: sourceView)
    let rtl = navigation.view.effectiveUserInterfaceLayoutDirection == .rightToLeft
    guard abs(translation.x) > abs(translation.y), rtl ? translation.x < 0 : translation.x > 0 else { return false }

    if let limits = navigation.topViewController?.view
      .safeValue(forKey: "gestureResponseDistance") as? [String: NSNumber]
    {
      let point = pan.location(in: sourceView)
      let horizontal = rtl ? sourceView.bounds.width - point.x : point.x
      let minimums = ["start": horizontal, "top": point.y]
      let maximums = ["end": horizontal, "bottom": point.y]
      guard minimums.allSatisfy({ key, value in
        guard let limit = limits[key], limit.doubleValue != -1 else { return true }
        return value >= CGFloat(truncating: limit)
      }), maximums.allSatisfy({ key, value in
        guard let limit = limits[key], limit.doubleValue != -1 else { return true }
        return value <= CGFloat(truncating: limit)
      }) else { return false }
    }
    // Query the navigator's native gesture decision without selecting screens'
    // custom full-width animator. UIKit keeps ownership of the transition.
    return sourceDelegate?.gestureRecognizerShouldBegin?(edge) ?? true
  }

  func gestureRecognizer(_: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
    guard let sourcePan else { return false }
    return sourceDelegate?.gestureRecognizer?(sourcePan, shouldReceive: touch) ?? true
  }

  @available(iOS 13.4, *)
  func gestureRecognizer(_: UIGestureRecognizer, shouldReceive event: UIEvent) -> Bool {
    guard let sourcePan else { return false }
    // Preserve gestureEnabled/fullScreenGestureEnabled and modal/root guards.
    return sourceDelegate?.gestureRecognizer?(sourcePan, shouldReceive: event) ?? true
  }

  func gestureRecognizer(_: UIGestureRecognizer, shouldBeRequiredToFailBy other: UIGestureRecognizer) -> Bool {
    if other === edge {
      return true
    }
    guard let edge else { return false }
    return sourceDelegate?.gestureRecognizer?(edge, shouldBeRequiredToFailBy: other) ?? false
  }

  func gestureRecognizer(_: UIGestureRecognizer, shouldRequireFailureOf other: UIGestureRecognizer) -> Bool {
    if other === edge {
      return false
    }
    guard let edge else { return false }
    return sourceDelegate?.gestureRecognizer?(edge, shouldRequireFailureOf: other) ?? false
  }

  func gestureRecognizer(_: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith other: UIGestureRecognizer) -> Bool {
    guard let edge else { return false }
    return sourceDelegate?.gestureRecognizer?(edge, shouldRecognizeSimultaneouslyWith: other) ?? false
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
