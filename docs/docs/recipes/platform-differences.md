---
sidebar_position: 2
---

# Platforms capabilities and limitations

This library relies on `WindowInsetsCompat` API on `Android` and keyboard listeners (`NotificationCenter`) on iOS.

Since two platforms are totally different (see below for more details) the purpose of this API is to provide a common API for both platforms, which will work in the same way on both platforms, but at the same time give an access to all power of the platform features.

## Android

To track each keyboard frame in Android you need to perform 3 steps:

- enter [edge-to-edge](https://developer.android.com/training/gestures/edge-to-edge) mode (`KeyboardControllerView` already does it for you, and `KeyboardProvider` uses `KeyboardControllerView`, so once you've wrapped your app in `KeyboardProvider` - you've completed this step 🎉).
- change `android:windowSoftInputMode` to `adjustResize` (this library exposes [KeyboardController](./../api/keyboard-controller.md) and you can change it in runtime - default hooks changes soft input mode on mount and restore default behavior on unmount, but you can control it as you wish (change mode on focus/unfocus screen etc.));
- setup `WindowInsetsAnimationCallback` and track keyboard frames. `KeyboardControllerView` maps events from this callback and forward them in `onKeyboardMove` callback on JS side.

## iOS