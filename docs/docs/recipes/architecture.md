---
sidebar_position: 1
---

# Architecture

This library requires to wrap an app with `KeyboardProvider` component. It's needed because it stores animated values in `context`.

## Process overview

Library exposes `KeyboardControllerView` with `onKeyboardMove` method. This method is fired when keyboard frame is changed. `KeyboardProvider` automatically maps these events to `Animated.Value` and `Reanimated.SharedValue` and stores it in `context`.

:::info
Underhood `KeyboardControllerView` is a simple `View` with one additional `onKeyboardMove` callback method, so it inherits all props from plain `View`, such as `style`, etc.
:::

Thus we have a single source of truth about keyboard position. Since values are stored in `context` we can use it in any component where we need them. Moreover, we can consume `context` values in class components as well as in hooks.

## Design principles

The library was designed to use a `context` as a global store for animated values and have a single `Provider` across the app. As of now it may be not very obvious, why it was needed to have a single source of data flow, but in future it may significantly simplify the process of the integration new features.

- TODO: view on android - easier to control styles, view positions, etc.
- TODO: view may accept animated values.