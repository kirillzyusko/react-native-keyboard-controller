import UIKit

/// Layout callbacks for keyboard movement during an interactive navigation transition.
final class KeyboardBackSwipeTransition {
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
  private var transition: ObjectIdentifier?
  private var lastHeight: CGFloat = 0
  private var tag: NSNumber = -1

  init(dispatch: @escaping Dispatch) {
    self.dispatch = dispatch
  }

  func invalidate() {
    transition = nil
  }

  func send(_ name: NSString, _ height: NSNumber, _ progress: NSNumber, _ duration: NSNumber, _ target: NSNumber) {
    if name == "onKeyboardMoveStart" {
      let visible = height.doubleValue > 0
      KeyboardBackSwipeGesture.shared.keyboardWillChange(visible: visible)
      if visible, let focusedOwner = UIResponder.current?.parentViewController, focusedOwner !== owner {
        invalidate()
        owner = focusedOwner
      }
    }
    if target.intValue != -1 {
      tag = target
    }
    if transition == nil, lastHeight > 0, let mode = Self.mode, mode != .close,
       let owner, let navigation = owner.navigationController, let coordinator = owner.transitionCoordinator,
       coordinator.isInteractive, coordinator.viewController(forKey: .from) === owner,
       !navigation.viewControllers.contains(owner)
    {
      begin(mode, coordinator: coordinator)
    }
    lastHeight = CGFloat(truncating: height)
    if transition == nil {
      dispatch(name, height, progress, duration, target)
    }
  }

  private func begin(_ mode: Mode, coordinator: UIViewControllerTransitionCoordinator) {
    let coordinatorID = ObjectIdentifier(coordinator)
    let initialHeight = lastHeight
    transition = coordinatorID

    // UIKit scrubs and reverses animations in this block with the navigation gesture.
    let queued = coordinator.animate(alongsideTransition: { [weak self] context in
      guard let self, self.transition == coordinatorID, mode == .interactively else { return }
      self.dispatch("onKeyboardMoveStart", 0, 0, (context.transitionDuration * 1000) as NSNumber, self.tag)
    }, completion: { [weak self] context in
      let cancelled = context.isCancelled
      DispatchQueue.main.async {
        guard let self, self.transition == coordinatorID else { return }
        self.transition = nil
        let height = cancelled ? initialHeight : self.lastHeight
        self.lastHeight = height
        let progress: NSNumber = height > 0 ? 1 : 0
        self.dispatch("onKeyboardMoveStart", height as NSNumber, progress, 0, self.tag)
        self.dispatch("onKeyboardMoveEnd", height as NSNumber, progress, 0, self.tag)
      }
    })
    if !queued {
      transition = nil
    }
  }
}
