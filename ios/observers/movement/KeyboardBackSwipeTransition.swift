import UIKit

/// Layout callbacks for keyboard movement during an interactive navigation transition.
final class KeyboardBackSwipeTransition: NSObject {
  enum Mode: String {
    case close, none, interactively
  }

  static var mode: Mode? {
    didSet {
      KeyboardBackSwipeGesture.shared.setEnabled(mode == .close)
    }
  }

  typealias Dispatch = (NSString, NSNumber, NSNumber, NSNumber, NSNumber) -> Void
  private let dispatch: Dispatch
  private weak var owner: UIViewController?
  private var activeMode: Mode?
  private var generation = 0
  private var lastHeight: CGFloat = 0
  private var heldHeight: CGFloat = 0
  private var tag: NSNumber = -1
  private var link: CADisplayLink?
  private weak var sourceView: UIView?
  private var sourceOriginX: CGFloat = 0

  init(dispatch: @escaping Dispatch) {
    self.dispatch = dispatch
    super.init()
  }

  func invalidate() {
    generation += 1
    link?.invalidate()
    link = nil
    activeMode = nil
    sourceView = nil
  }

  func send(_ name: NSString, _ height: NSNumber, _ progress: NSNumber, _ duration: NSNumber, _ target: NSNumber) {
    if name == "onKeyboardMoveStart" {
      KeyboardBackSwipeGesture.shared.keyboardWillChange(visible: height.doubleValue > 0)
    }
    let focusedOwner = name == "onKeyboardMoveStart" && height.doubleValue > 0
      ? UIResponder.current?.parentViewController : nil
    // Focus on a different screen takes precedence over an outgoing screen's policy.
    if activeMode != nil, height.doubleValue > 0, name == "onKeyboardMoveStart",
       let focusedOwner, focusedOwner !== owner
    {
      invalidate()
    }
    if activeMode == nil {
      if name == "onKeyboardMoveStart", height.doubleValue > 0, let focusedOwner {
        owner = focusedOwner
      }
      if let mode = Self.mode, mode != .close, let owner, let coordinator = owner.transitionCoordinator,
         coordinator.isInteractive,
         let from = coordinator.viewController(forKey: .from), from === owner,
         let navigation = owner.navigationController, !navigation.viewControllers.contains(from)
      {
        begin(mode, coordinator: coordinator)
      }
    }
    lastHeight = CGFloat(truncating: height)
    if target.intValue != -1 {
      tag = target
    }
    guard activeMode == nil else { return }
    dispatch(name, height, progress, duration, target)
  }

  private func begin(_ mode: Mode, coordinator: UIViewControllerTransitionCoordinator) {
    activeMode = mode
    heldHeight = lastHeight
    generation += 1
    let currentGeneration = generation
    sourceView = coordinator.viewController(forKey: .from)?.view
    sourceOriginX = sourceView?.superview?.convert(.zero, to: nil).x ?? 0
    if mode == .interactively {
      link = CADisplayLink(target: self, selector: #selector(sample))
      link?.preferredFramesPerSecond = 120
      link?.add(to: .main, forMode: .common)
    }
    coordinator.animate(alongsideTransition: nil) { [weak self] context in
      guard let self, self.generation == currentGeneration else { return }
      let cancelled = context.isCancelled
      DispatchQueue.main.async {
        guard self.generation == currentGeneration else { return }
        let height = cancelled ? self.heldHeight : self.lastHeight
        self.invalidate()
        self.lastHeight = height
        UIView.performWithoutAnimation {
          self.dispatch("onKeyboardMoveStart", height as NSNumber, height > 0 ? 1 : 0, 0, self.tag)
          self.dispatch("onKeyboardMoveEnd", height as NSNumber, height > 0 ? 1 : 0, 0, self.tag)
        }
      }
    }
  }

  @objc private func sample() {
    guard let sourceView, sourceView.bounds.width > 0 else { return }
    let layer = sourceView.layer.presentation() ?? sourceView.layer
    let frame = layer.convert(layer.bounds, to: nil)
    let transitionProgress = min(1, max(0, abs(frame.minX - sourceOriginX) / sourceView.bounds.width))
    let height = heldHeight * (1 - transitionProgress)
    let progress = heldHeight > 0 ? height / heldHeight : 0
    UIView.performWithoutAnimation {
      dispatch("onKeyboardMoveInteractive", height as NSNumber, progress as NSNumber, -1, tag)
    }
  }
}
