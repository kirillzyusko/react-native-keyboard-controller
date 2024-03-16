---
sidebar_position: 3
keywords: [react-native-keyboard-controller, KeyboardControllerView, view]
---

# KeyboardControllerView

A plain react-native `View` with some additional methods and props. Used internally in [KeyboardProvider](./keyboard-provider.md)

## Props

### `onKeyboardMoveStart`

A callback function which is fired when keyboard starts a transition from one to another state (from closed to open, for example).

### `onKeyboardMove`

A callback function which is fired every time, when keyboard changes its position on the screen.

### `onKeyboardMoveInteractive`

A callback function which is fired every time, when user drags keyboard.

### `onKeyboardMoveEnd`

A callback function which is fired when keyboard finished a transition from one to another state (from closed to open, for example).

### `statusBarTranslucent` <div class="label android"></div>

A boolean prop to indicate whether `StatusBar` should be translucent on `Android` or not.

### `navigationBarTranslucent` <div class="label android"></div>

A boolean prop to indicate whether [NavigationBar](https://m2.material.io/design/platform-guidance/android-bars.html#android-navigation-bar) should be translucent on `Android` or not.
