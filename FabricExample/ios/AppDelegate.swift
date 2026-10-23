//
//  AppDelegate.swift
//  KeyboardControllerFabricExample
//
//  Created by Kiryl Ziusko on 08/02/2025.
//

import ObjectiveC
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?
  private var launchOptions: [UIApplication.LaunchOptionsKey: Any]?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    #if DEBUG
      if CommandLine.arguments.contains("--issue243-trace") {
        InteractiveSwipeTrace.shared.start()
      }
    #endif
    self.launchOptions = launchOptions

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    return true
  }

  func application(
    _ application: UIApplication,
    configurationForConnecting connectingSceneSession: UISceneSession,
    options: UIScene.ConnectionOptions
  ) -> UISceneConfiguration {
    let configuration = UISceneConfiguration(
      name: "Default Configuration",
      sessionRole: connectingSceneSession.role
    )
    configuration.delegateClass = SceneDelegate.self
    return configuration
  }

  func startReactNative(in window: UIWindow) {
    self.window = window

    reactNativeFactory?.startReactNative(
      withModuleName: "KeyboardControllerFabricExample",
      in: window,
      launchOptions: launchOptions
    )
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
      RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
      Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}

#if DEBUG
/// Diagnostic only: observe lifecycle, responder calls and model/presentation geometry.
final class InteractiveSwipeTrace: NSObject {
  static let shared = InteractiveSwipeTrace()
  var entries: [[String: Any]] = []
  var until = 0.0
  var displayLink: CADisplayLink?
  weak var input: UIView?
  weak var title: UIView?
  weak var navigation: UINavigationController?
  var wasInteractive = false
  var loggedConfig = false
  func mark(_ event: String, _ values: [String: Any] = [:]) {
    var v = values
    v["event"] = event; v["time"] = CACurrentMediaTime(); v["wall"] = Date().timeIntervalSince1970 * 1000
    entries.append(v)
  }

  func flush() {
    let url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("interactive-swipe-native.json")
    if let data = try? JSONSerialization.data(withJSONObject: entries, options: [.sortedKeys]) {
      try? data.write(to: url, options: .atomic)
    }
  }

  func start() {
    for name in [UIResponder.keyboardWillShowNotification, UIResponder.keyboardDidShowNotification,
          UIResponder.keyboardWillHideNotification, UIResponder.keyboardDidHideNotification,
          UIResponder.keyboardWillChangeFrameNotification, UIResponder.keyboardDidChangeFrameNotification]
    {
      NotificationCenter.default.addObserver(forName: name, object: nil, queue: .main) { n in
        self.mark(n.name.rawValue, ["duration": n.userInfo?[UIResponder.keyboardAnimationDurationUserInfoKey] ?? 0,
                      "curve": n.userInfo?[UIResponder.keyboardAnimationCurveUserInfoKey] ?? 0, "inheritedAnimationDuration": UIView.inheritedAnimationDuration, "animationsEnabled": UIView.areAnimationsEnabled, "transactionDuration": CATransaction.animationDuration(), "transactionDisableActions": CATransaction.disableActions(),
                      "begin": (n.userInfo?[UIResponder.keyboardFrameBeginUserInfoKey] as? NSValue).map { NSCoder.string(for: $0.cgRectValue) } ?? "",
                      "end": (n.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue).map { NSCoder.string(for: $0.cgRectValue) } ?? ""])
        self.until = CACurrentMediaTime() + 2
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) { self.flush() }
      }
    }
    for (selector, event) in [(#selector(UIResponder.resignFirstResponder), "resign"), (#selector(UIResponder.becomeFirstResponder), "become")] {
      guard let method = class_getInstanceMethod(UITextView.self, selector) else { continue }
      typealias Original = @convention(c) (UIView, Selector) -> Bool
      let original = unsafeBitCast(method_getImplementation(method), to: Original.self)
      let block: @convention(block) (UIView) -> Bool = { view in
        self.mark(event + ".request", ["class": NSStringFromClass(type(of: view)), "id": view.accessibilityIdentifier ?? "", "stack": Thread.callStackSymbols])
        let result = original(view, selector)
        self.mark(event + ".result", ["result": result])
        return result
      }
      let impl = imp_implementationWithBlock(block)
      if !class_addMethod(UITextView.self, selector, impl, method_getTypeEncoding(method)) {
        method_setImplementation(method, impl)
      }
    }
    displayLink = CADisplayLink(target: self, selector: #selector(tick))
    displayLink?.preferredFramesPerSecond = 30
    displayLink?.add(to: .main, forMode: .common)
  }

  func windows() -> [UIWindow] {
    UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.flatMap { $0.windows }
  }

  func geometry(_ v: UIView) -> [String: Any] {
    let p = v.layer.presentation()
    return ["class": NSStringFromClass(type(of: v)), "id": v.accessibilityIdentifier ?? "", "frame": NSCoder.string(for: v.frame),
        "model": NSCoder.string(for: v.convert(v.bounds, to: nil)), "presentation": NSCoder.string(for: p?.convert(p!.bounds, to: nil) ?? v.convert(v.bounds, to: nil)),
        "bounds": NSCoder.string(for: v.bounds), "alpha": v.alpha, "hidden": v.isHidden, "focused": v.isFirstResponder, "animations": v.layer.animationKeys() ?? [], "transform": [v.transform.a, v.transform.b, v.transform.c, v.transform.d, v.transform.tx, v.transform.ty], "animationDescriptions": (v.layer.animationKeys() ?? []).map { v.layer.animation(forKey: $0)?.debugDescription ?? "" }, "scroll": (v as? UIScrollView).map { ["offset": NSCoder.string(for: $0.contentOffset), "inset": NSCoder.string(for: $0.contentInset)] } ?? [:]]
  }

  @objc func tick() {
    var active: [[String: Any]] = []
    var ancestor = input
    while let v = ancestor {
      for recognizer in v.gestureRecognizers ?? [] {
        if let pan = recognizer as? UIPanGestureRecognizer, [.began, .changed].contains(pan.state) {
          active.append(["class": NSStringFromClass(type(of: pan)), "state": pan.state.rawValue, "translation": NSCoder.string(for: pan.translation(in: pan.view)), "velocity": NSCoder.string(for: pan.velocity(in: pan.view))])
        }
      }
      ancestor = v.superview
    }
    let coordinator = navigation?.transitionCoordinator
    let interactive = coordinator?.isInteractive == true || !active.isEmpty
    if interactive {
      until = CACurrentMediaTime() + 1
    }
    if wasInteractive && !interactive {
      DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) { self.flush() }
    }
    wasInteractive = interactive
    guard CACurrentMediaTime() < until else { return }
    let ws = windows()
    var keyboard: [[String: Any]] = []
    var scrolls: [[String: Any]] = []
    func visit(_ v: UIView, _ depth: Int) {
      let cls = NSStringFromClass(type(of: v))
      if v.accessibilityIdentifier == "chat.input" {
        input = v
      }
      if v is UIScrollView {
        scrolls.append(geometry(v))
      }
      if v.accessibilityIdentifier == "issue243-unused-title" {
        title = v
      }
      if ["Keyboard", "InputSet", "InputHost", "Replicant", "TrackingWindow", "Snapshot"].contains(where: { cls.contains($0) }) {
        keyboard.append(geometry(v))
      }
      if depth < 40 {
        v.subviews.forEach { visit($0, depth + 1) }
      }
    }
    ws.forEach { visit($0, 0) }
    if let input {
      var responder: UIResponder? = input
      while let current = responder {
        if let vc = current as? UIViewController, let nav = vc.navigationController {
          navigation = nav; break
        }
        responder = current.next
      }
    }
    if let nav = navigation, !loggedConfig {
      loggedConfig = true
      let g = nav.interactivePopGestureRecognizer
      mark("navigation.configuration", ["count": nav.viewControllers.count, "edgeEnabled": g?.isEnabled ?? false, "edgeState": g?.state.rawValue ?? -1, "edgeClass": g.map { NSStringFromClass(type(of: $0)) } ?? "nil", "delegate": g?.delegate.map { NSStringFromClass(type(of: $0)) } ?? "nil"])
    }
    var chain: [[String: Any]] = []
    ancestor = input
    while let v = ancestor {
      chain.append(geometry(v)); ancestor = v.superview
    }
    mark("frame", ["inputAncestors": chain, "title": title.map { geometry($0) } ?? [:], "keyboard": keyboard, "scrolls": scrolls, "gestures": active,
           "transition": coordinator.map { ["interactive": $0.isInteractive, "percent": $0.percentComplete, "duration": $0.transitionDuration] } ?? [:]])
  }
}
#endif
