---
sidebar_position: 5
keywords: [react-native-keyboard-controller, KeyboardControllerView, view]
---

# KeyboardControllerView

A plain react-native `View` with some additional methods and props. Used internally in [KeyboardProvider](../keyboard-provider.md)

## Props

### `onKeyboardMoveStart`

A callback function which is fired when keyboard starts a transition from one to another state (from closed to open, for example).

### `onKeyboardMove`

A callback function which is fired every time, when keyboard changes its position on the screen.

### `onKeyboardMoveInteractive`

A callback function which is fired every time, when user drags keyboard.

### `onKeyboardMoveEnd`

A callback function which is fired when keyboard finished a transition from one to another state (from closed to open, for example).

### `onFocusedInputLayoutChanged`

A callback function which is fired when layout of focused input gets changed.

### `onFocusedInputTextChanged`

A callback function which is fired every time when user changes a text (types/deletes symbols).

### `onFocusedInputSelectionChanged`

A callback function which is fired when user selects text in focused input.

### `statusBarTranslucent` <div className="label android"></div>

A boolean prop to indicate whether `StatusBar` should be translucent on `Android` or not.

### `navigationBarTranslucent` <div className="label android"></div>

A boolean prop to indicate whether [NavigationBar](https://m2.material.io/design/platform-guidance/android-bars.html#android-navigation-bar) should be translucent on `Android` or not.

### `preserveEdgeToEdge` <div className="label android"></div>

A boolean property indicating whether to keep [edge-to-edge](https://developer.android.com/develop/ui/views/layout/edge-to-edge) mode always enabled (even when you disable the module). This is useful if you are using an external library to enable it and don't want this library to disable it.

### `enabled`

A boolean prop indicating whether the view is active or not. If it's `true` then it moves application to [edge-to-edge](https://developer.android.com/training/gestures/edge-to-edge) mode on Android and setup keyboard callbacks. When `false` - moves app away from [edge-to-edge](https://developer.android.com/training/gestures/edge-to-edge) and removes keyboard listeners.
