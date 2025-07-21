# KeyboardControllerView

A plain react-native `View` with some additional methods and props. Used internally in [KeyboardProvider](/react-native-keyboard-controller/docs/api/keyboard-provider.md)

## Props[​](/react-native-keyboard-controller/docs/api/views/keyboard-controller-view.md#props "Direct link to Props")

### `onKeyboardMoveStart`[​](/react-native-keyboard-controller/docs/api/views/keyboard-controller-view.md#onkeyboardmovestart "Direct link to onkeyboardmovestart")

A callback function which is fired when keyboard starts a transition from one to another state (from closed to open, for example).

### `onKeyboardMove`[​](/react-native-keyboard-controller/docs/api/views/keyboard-controller-view.md#onkeyboardmove "Direct link to onkeyboardmove")

A callback function which is fired every time, when keyboard changes its position on the screen.

### `onKeyboardMoveInteractive`[​](/react-native-keyboard-controller/docs/api/views/keyboard-controller-view.md#onkeyboardmoveinteractive "Direct link to onkeyboardmoveinteractive")

A callback function which is fired every time, when user drags keyboard.

### `onKeyboardMoveEnd`[​](/react-native-keyboard-controller/docs/api/views/keyboard-controller-view.md#onkeyboardmoveend "Direct link to onkeyboardmoveend")

A callback function which is fired when keyboard finished a transition from one to another state (from closed to open, for example).

### `onFocusedInputLayoutChanged`[​](/react-native-keyboard-controller/docs/api/views/keyboard-controller-view.md#onfocusedinputlayoutchanged "Direct link to onfocusedinputlayoutchanged")

A callback function which is fired when layout of focused input gets changed.

### `onFocusedInputTextChanged`[​](/react-native-keyboard-controller/docs/api/views/keyboard-controller-view.md#onfocusedinputtextchanged "Direct link to onfocusedinputtextchanged")

A callback function which is fired every time when user changes a text (types/deletes symbols).

### `onFocusedInputSelectionChanged`[​](/react-native-keyboard-controller/docs/api/views/keyboard-controller-view.md#onfocusedinputselectionchanged "Direct link to onfocusedinputselectionchanged")

A callback function which is fired when user selects text in focused input.

### `statusBarTranslucent`[​](/react-native-keyboard-controller/docs/api/views/keyboard-controller-view.md#statusbartranslucent- "Direct link to statusbartranslucent-")

A boolean prop to indicate whether `StatusBar` should be translucent on `Android` or not.

### `navigationBarTranslucent`[​](/react-native-keyboard-controller/docs/api/views/keyboard-controller-view.md#navigationbartranslucent- "Direct link to navigationbartranslucent-")

A boolean prop to indicate whether [NavigationBar](https://m2.material.io/design/platform-guidance/android-bars.html#android-navigation-bar) should be translucent on `Android` or not.

### `preserveEdgeToEdge`[​](/react-native-keyboard-controller/docs/api/views/keyboard-controller-view.md#preserveedgetoedge- "Direct link to preserveedgetoedge-")

A boolean property indicating whether to keep [edge-to-edge](https://developer.android.com/develop/ui/views/layout/edge-to-edge) mode always enabled (even when you disable the module). This is useful if you are using an external library to enable it and don't want this library to disable it.

### `enabled`[​](/react-native-keyboard-controller/docs/api/views/keyboard-controller-view.md#enabled "Direct link to enabled")

A boolean prop indicating whether the view is active or not. If it's `true` then it moves application to [edge-to-edge](https://developer.android.com/training/gestures/edge-to-edge) mode on Android and setup keyboard callbacks. When `false` - moves app away from [edge-to-edge](https://developer.android.com/training/gestures/edge-to-edge) and removes keyboard listeners.
