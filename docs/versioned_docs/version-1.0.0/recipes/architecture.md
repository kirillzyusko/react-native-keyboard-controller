---
sidebar_position: 1
---

# Architecture

This library requires to wrap an app with `KeyboardProvider` component. It's needed because it stores animated values in `context`.

## Process overview

Library exposes `KeyboardControllerView` with `onKeyboardMove` method. This method is fired when keyboard frame is changed. `KeyboardProvider` automatically maps these events to `Animated.Value` and `Reanimated.SharedValue` and stores it in `context`.

:::info
Under the hood `KeyboardControllerView` is a simple `View` with one additional `onKeyboardMove` callback method, so it inherits all props from plain `View`, such as `style`, etc.
:::

Thus we have a single source of truth about keyboard position. Since values are stored in `context` we can use it in any component where we need them. Moreover, we can consume `context` values in class components as well as in hooks.

## Design principles

The library was designed to use a `context` as a global store for animated values and have a single `Provider` across the app. As of now it may be not very obvious, why it was needed to have a single source of data flow, but in future it may significantly simplify the process of the integration new features.

## Why custom `KeyboardControllerView` is needed?

Initially I had a choice which approach to use in order to send events about keyboard frames: `EventEmitters` vs `View` with callbacks. I decided to use `View` with callbacks because of several reasons:

- `react-native` core team uses similar approach for `onScroll` event from `ScrollView` component (also I knew, that it's possible to map events from such callbacks to `Animated.Value` and thus reduce bridge usage);
- to track keyboard frames on Android we need to enter to [edge-to-edge](https://developer.android.com/training/gestures/edge-to-edge) mode and it changes view paddings. Since it's managed through `View` it's easier to change padding of this view.
- in future it may be needed to send `Animated.Value` from JS to native thread (interactive keyboard dismissing on `Android`). And in community there a lot of libraries which are accepting props as `Animated.Value` (for example `lottie` and its `progress` prop).
