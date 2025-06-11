# Architecture

This library requires to wrap an app with `KeyboardProvider` component. It's needed because it stores animated values in `context`.

## Process overview[​](/react-native-keyboard-controller/docs/recipes/architecture.md#process-overview "Direct link to Process overview")

Library exposes `KeyboardControllerView` with `onKeyboardMove` method. This method is fired when keyboard frame is changed. `KeyboardProvider` automatically maps these events to `Animated.Value` and `Reanimated.SharedValue` and stores it in `context`.

info

Under the hood `KeyboardControllerView` is a simple `View` with one additional `onKeyboardMove` callback method, so it inherits all props from plain `View`, such as `style`, etc.

Thus we have a single source of truth about keyboard position. Since values are stored in `context` we can use it in any component where we need them. Moreover, we can consume `context` values in class components as well as in hooks.

## Design principles[​](/react-native-keyboard-controller/docs/recipes/architecture.md#design-principles "Direct link to Design principles")

The library was designed to use a `context` as a global store for animated values and have a single `Provider` across the app. As of now it may be not very obvious, why it was needed to have a single source of data flow, but in future it may significantly simplify the process of the integration new features.

## Why custom `KeyboardControllerView` is needed?[​](/react-native-keyboard-controller/docs/recipes/architecture.md#why-custom-keyboardcontrollerview-is-needed "Direct link to why-custom-keyboardcontrollerview-is-needed")

Initially I had a choice which approach to use in order to send events about keyboard frames: `EventEmitters` vs `View` with callbacks. I decided to use `View` with callbacks because of several reasons:

* `react-native` core team uses similar approach for `onScroll` event from `ScrollView` component (also I knew, that it's possible to map events from such callbacks to `Animated.Value` and thus reduce bridge usage);
* to track keyboard frames on Android we need to enter to [edge-to-edge](https://developer.android.com/training/gestures/edge-to-edge) mode and it changes view paddings. Since it's managed through `View` it's easier to change padding of this view.
* `reanimated` allows to intercept `view` events using theirs `useEvent` hook and move the event handling into worklet runtime. Thus sending events via `view` allows to make an integration with `reanimated` package and handle events/animate everything directly on the UI thread.

## What is the difference between `useAnimatedKeyboard` from `react-native-reanimated` and this library?[​](/react-native-keyboard-controller/docs/recipes/architecture.md#what-is-the-difference-between-useanimatedkeyboard-from-react-native-reanimated-and-this-library "Direct link to what-is-the-difference-between-useanimatedkeyboard-from-react-native-reanimated-and-this-library")

`react-native-keyboard-controller` uses its own implementation for keyboard handling and leverages `react-native-reanimated` solely for performing UI thread updates using `SharedValue` (the library doesn't simply re-export `useAnimatedKeyboard` hook in any kind of form).

While both `useAnimatedKeyboard` from `react-native-reanimated` and this library aims to provide the same functionality, there are some differences between them. Below you can find a comparison of the two libraries:

|                                                                                                                       | `react-native-keyboard-controller` | `react-native-reanimated` |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------- |
| Map keyboard movement to animated value                                                                               | ✅                                 | ✅                        |
| Synchronously update keyboard position on UI thread                                                                   | ✅                                 | ✅                        |
| Dynamically switch [`softInputMode`](/react-native-keyboard-controller/docs/api/keyboard-controller.md#setinputmode-) | ✅                                 | ❌                        |
| An ability to turn functionality on demand                                                                            | ✅                                 | 🟠 1                      |
| Android interactive keyboard support                                                                                  | ✅                                 | ❌                        |
| iOS interactive keyboard support                                                                                      | ✅                                 | ✅                        |
| Has pre-built components                                                                                              | ✅                                 | ❌                        |
| Works in `Modal` on Android                                                                                           | ✅                                 | 🟠 2                      |
| Is ready-to-use library for keyboard avoidance3                                                                       | ✅                                 | ❌                        |
| `KeyboardToolbar` component                                                                                           | ✅                                 | ❌                        |
| `OverKeyboardView` component                                                                                          | ✅                                 | ❌                        |

> 1 You need to unmount all components that use `useAnimatedKeyboard` to disable module functionality, which can be hard to achieve if you are using deep Stack-navigators.

> 2 Planned to be added in the future

> 3 The `react-native-keyboard-controller` tracks focused input changes (apart of keyboard tracking) and thus brings advanced concepts for keyboard avoidance.

To sum it up:

* if you are using `useAnimatedKeyboard` and you are satisfied with it, then there is no sense to switch to `react-native-keyboard-controller`;

* if you are planning to add advanced keyboard handling into large existing project, then `react-native-keyboard-controller` can be a better choice, since it has drop-in replacement components (`KeyboardAvoidingView`, `KeyboardAwareScrollView`, etc.), you can toggle the functionality dynamically on per screen basic, you can dynamically change `softInputMode` which should simplify the integration process.
