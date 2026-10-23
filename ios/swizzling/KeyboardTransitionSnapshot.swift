import ObjectiveC
import UIKit

/// Opt-in workaround for gray adaptive keyboard snapshots during iOS 26 navigation.
/// A live portal preserves the native transition and samples the current backdrop.
enum KeyboardTransitionSnapshot {
  private static let installation: Bool = {
    guard #available(iOS 26.0, *),
          let snapshotterClass = NSClassFromString("UIKBViewTreeSnapshotter"),
          let portalClass = NSClassFromString("_UIPortalView") as? UIView.Type
    else { return false }

    let selector = NSSelectorFromString("snapshotterForKeyboardView:afterScreenUpdates:")
    guard let method = class_getClassMethod(snapshotterClass, selector),
          method_getNumberOfArguments(method) == 4,
          class_getInstanceVariable(snapshotterClass, "_snapshotView") != nil
    else { return false }
    for name in [
      "setSourceView:", "setMatchesPosition:", "setMatchesTransform:", "setMatchesAlpha:", "setHidesSourceView:",
    ] {
      guard class_getInstanceMethod(portalClass, NSSelectorFromString(name)) != nil else { return false }
    }
    let returnType = method_copyReturnType(method)
    guard let updatesType = method_copyArgumentType(method, 3) else { free(returnType); return false }
    defer { free(returnType); free(updatesType) }
    guard String(cString: returnType) == "@", String(cString: updatesType) == "B" else { return false }

    typealias Original = @convention(c) (AnyObject, Selector, UIView, Bool) -> Unmanaged<NSObject>?
    let original = unsafeBitCast(method_getImplementation(method), to: Original.self)
    let replacement: @convention(block) (AnyObject, UIView, Bool) -> NSObject? = { object, view, updates in
      guard let snapshotter = original(object, selector, view, updates)?.takeUnretainedValue() else { return nil }
      guard Thread.isMainThread,
            ["UIInputSetContainerView", "UITrackingWindowView"].contains(NSStringFromClass(type(of: view)))
      else { return snapshotter }

      let portal = portalClass.init(frame: view.bounds)
      portal.setValue(view, forKey: "sourceView")
      portal.setValue(false, forKey: "matchesPosition")
      portal.setValue(false, forKey: "matchesTransform")
      portal.setValue(false, forKey: "matchesAlpha")
      portal.setValue(true, forKey: "hidesSourceView")
      portal.isUserInteractionEnabled = false
      snapshotter.setValue(portal, forKey: "snapshotView")
      return snapshotter
    }
    method_setImplementation(method, imp_implementationWithBlock(replacement))
    return true
  }()

  static func install() -> Bool {
    installation
  }
}
