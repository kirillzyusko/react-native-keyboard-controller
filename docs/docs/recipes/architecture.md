---
sidebar_position: 1
---

# Architecture

This library requires to wrap an app with `KeyboardProvider` component. It's needed because it stores animated values in `context`.

Library exposes `KeyboardControllerView` with `onKeyboardMove` method. This method is fired when keyboard frame is changed. `KeyboardProvider` automatically maps it to `Animated.Value` and stores it in `context`.