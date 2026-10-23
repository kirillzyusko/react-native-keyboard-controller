// swift-tools-version: 6.0

import Foundation
import PackageDescription

let swiftSources = try FileManager.default.subpathsOfDirectory(atPath: "\(Context.packageDirectory)/ios")
  .filter { $0.hasSuffix(".swift") && !$0.hasPrefix("KeyboardControllerNative/") }
  .map { "ios/\($0)" }.sorted()

let package = Package(
  name: "ReactNativeKeyboardController",
  platforms: [.iOS("15.1")],
  products: [
    .library(name: "ReactNativeKeyboardController", type: .static, targets: ["ReactNativeKeyboardController"]),
  ],
  dependencies: [
    // Resolved through React Native's build/generated/autolinking/libs symlink.
    .package(name: "ReactNative", path: "../../../../xcframeworks"),
    .package(name: "React-GeneratedCode", path: "../../../ios"),
  ],
  targets: [
    .target(
      name: "KeyboardControllerObjC",
      path: "ios/objc",
      exclude: ["RCTUIManager+LayoutAnimationManager.m"],
      publicHeadersPath: "."
    ),
    .target(
      name: "react_native_keyboard_controller",
      dependencies: ["KeyboardControllerObjC"],
      path: "ios",
      exclude: ["views/KeyboardControllerViewManager.swift"],
      sources: swiftSources.map { String($0.dropFirst(4)) },
      swiftSettings: [.define("KEYBOARD_CONTROLLER_NEW_ARCH_ENABLED")],
      linkerSettings: [.linkedFramework("UIKit"), .linkedFramework("QuartzCore")]
    ),
    .target(
      name: "ReactNativeKeyboardController",
      dependencies: [
        .product(name: "ReactHeaders", package: "ReactNative"),
        .product(name: "ReactNativeHeaders", package: "ReactNative"),
        .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
        .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
        "react_native_keyboard_controller",
      ],
      path: ".",
      exclude: [
        "ios/objc", "ios/KeyboardControllerNative",
        "ios/views/KeyboardControllerViewManager.mm",
      ].filter { FileManager.default.fileExists(atPath: "\(Context.packageDirectory)/\($0)") } + swiftSources,
      sources: ["ios", "common/cpp"],
      publicHeadersPath: "ios",
      cSettings: [
        .define("RCT_NEW_ARCH_ENABLED", to: "1"),
        .headerSearchPath("ios"),
        .headerSearchPath("ios/events"),
      ],
      cxxSettings: [
        .define("RCT_NEW_ARCH_ENABLED", to: "1"),
        .define("DEBUG", .when(configuration: .debug)),
        .define("NDEBUG", .when(configuration: .release)),
        .headerSearchPath("ios"),
        .headerSearchPath("ios/events"),
        .headerSearchPath("common/cpp"),
      ]
    ),
  ],
  swiftLanguageModes: [.v5],
  cxxLanguageStandard: .cxx20
)
