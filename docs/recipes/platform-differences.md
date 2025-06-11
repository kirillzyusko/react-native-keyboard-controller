# Platforms capabilities and limitations

This library relies on `WindowInsetsCompat` API on `Android` and keyboard listeners (`NotificationCenter`) on iOS.

Since two platforms are totally different (see below for more details) the purpose of this API is to provide a common API for both platforms, which will work in the same way on both platforms, but at the same time give an access to all power of the platform features.

## Android[​](/react-native-keyboard-controller/docs/recipes/platform-differences.md#android "Direct link to Android")

To track each keyboard frame in Android you need to perform 3 steps:

* enter [edge-to-edge](https://developer.android.com/training/gestures/edge-to-edge) mode (`KeyboardControllerView` already does it for you, and `KeyboardProvider` uses `KeyboardControllerView`, so once you've wrapped your app in `KeyboardProvider` - you've completed this step 🎉).
* change `android:windowSoftInputMode` to `adjustResize` (this library exposes [KeyboardController](/react-native-keyboard-controller/docs/api/keyboard-controller.md) and you can change it in runtime - default hooks changes soft input mode on mount and restore default behavior on unmount, but you can control it as you [wish](/react-native-keyboard-controller/docs/guides/building-own-hook.md) (change mode on focus/unfocus screen etc.)) - this is needed to deliver the best [backward](https://developer.android.com/develop/ui/views/layout/sw-keyboard#check-visibility) compatibility and ***prevent*** automatic window resizing (`adjustResize` + `edge-to-edge` makes window not automatically resizable anymore);
* setup `WindowInsetsAnimationCallback` and track keyboard frames. `KeyboardControllerView` maps events from this callback and forward them in `onKeyboardMove` callback on JS side (`KeyboardProvider` handles it and maps these events to `Animated` values + stores it in `context`).

## iOS[​](/react-native-keyboard-controller/docs/recipes/platform-differences.md#ios "Direct link to iOS")

iOS doesn't give an API to track each keyboard frame. But it gives an information when keyboard will appear and when it appeared (i.e. the start and the end of the keyboard movement) and also it schedules layout animation.

Non discrete values

Unlike Android, `progress` value on iOS will have only two values (`0` or `1`) - i.e. it will not have an intermediate values, like 0.07, 0.12, 0.27 etc (same is applied to `height` property - it doesn't have an intermediate values). It's not a big problem, but some interpolations (which are relying on intermediate values) may not work properly.

If you are animating non UI props (such as `width`, `height`, etc.) and you need to have intermediate values - consider to use [useKeyboardHandler](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-handler.md) hook.
