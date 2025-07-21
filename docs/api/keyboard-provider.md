# KeyboardProvider

`KeyboardProvider` should wrap your app. Under the hood it works with `KeyboardControllerView` to receive events during keyboard movements, maps these events to `Animated`/`Reanimated` values and store them in `context`.

## Props[​](/react-native-keyboard-controller/docs/api/keyboard-provider.md#props "Direct link to Props")

### `statusBarTranslucent`[​](/react-native-keyboard-controller/docs/api/keyboard-provider.md#statusbartranslucent- "Direct link to statusbartranslucent-")

A boolean prop to indicate whether `StatusBar` should be translucent on `Android` or not.

Important defaults

By default this library stretches to full screen (`edge-to-edge` mode) and status bar becomes translucent. But the library tries to use standard RN app behavior and automatically applies padding from top to look like a standard RN app. If you use `translucent` prop for `StatusBar` component - it will not work anymore. You'll need to specify it on provider level. For more info [see](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/30) this PR.

### `navigationBarTranslucent`[​](/react-native-keyboard-controller/docs/api/keyboard-provider.md#navigationbartranslucent- "Direct link to navigationbartranslucent-")

A boolean prop to indicate whether [NavigationBar](https://m2.material.io/design/platform-guidance/android-bars.html#android-navigation-bar) should be translucent on `Android` or not.

### `preserveEdgeToEdge`[​](/react-native-keyboard-controller/docs/api/keyboard-provider.md#preserveedgetoedge- "Direct link to preserveedgetoedge-")

A boolean property indicating whether to keep [edge-to-edge](https://developer.android.com/develop/ui/views/layout/edge-to-edge) mode always enabled (even when you disable the module). This is useful if you are using an external library to enable it and don't want this library to disable it.

Good to know

If you use [react-native-edge-to-edge](https://github.com/zoontek/react-native-edge-to-edge), then `statusBarTranslucent`, `navigationBarTranslucent` and `preserveEdgeToEdge` are automatically set to `true`, so you don't need to worry about them.

### `preload`[​](/react-native-keyboard-controller/docs/api/keyboard-provider.md#preload- "Direct link to preload-")

A boolean prop that determines whether to preload the keyboard to eliminate the initial focus lag (improve TTI). Defaults to `true`.

Internally it calls imperative [`KeyboardController.preload()`](/react-native-keyboard-controller/docs/api/keyboard-controller.md#preload-) API.

Opting out of preloading

Set this to `false` if your app's initial screen doesn't include any inputs or if you prefer to control keyboard preloading manually.

In general, this method is lightweight and safe to call on app start without any noticeable performance cost.

### `enabled`[​](/react-native-keyboard-controller/docs/api/keyboard-provider.md#enabled "Direct link to enabled")

A boolean prop indicating whether the module is enabled. It indicate only initial state, i. e. if you try to change this prop after component mount it will not have any effect. To change the property in runtime use [useKeyboardController](/react-native-keyboard-controller/docs/api/hooks/module/use-keyboard-controller.md) hook and `setEnabled` method. Defaults to `true`.

Could be useful to set it to `false` if you want to activate the module only on specific screens.

## Example[​](/react-native-keyboard-controller/docs/api/keyboard-provider.md#example "Direct link to Example")

```
import { KeyboardProvider } from "react-native-keyboard-controller";

const App = () => {
  return (
    <KeyboardProvider>
      {/* The other components in your tree */}
    </KeyboardProvider>
  );
};
```
