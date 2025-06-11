# Compatibility

info

If you found an incompatibility or conflict with other open source libraries - don't hesitate to open an [issue](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/new?assignees=kirillzyusko\&labels=bug\&template=bug_report.md\&title=). It will help the project 🙏

## `react-native`[​](/react-native-keyboard-controller/docs/guides/compatibility.md#react-native "Direct link to react-native")

Below you can find an information about compatibility with `react-native` package per different architectures.

### Fabric (new) architecture[​](/react-native-keyboard-controller/docs/guides/compatibility.md#fabric-new-architecture "Direct link to Fabric (new) architecture")

Starting from `1.2.0` this library adds support for a new architecture called `Fabric`. Since a new architecture is still in adoption stage and it changes some APIs over time - it's highly recommended to use versions which are compatible and were intensively tested against specific `react-native` versions.

Below you can find a table with supported versions:

| library version | react-native version |
| --------------- | -------------------- |
| 1.16.0+         | 0.77.0+              |
| 1.13.0+         | 0.75.0+              |
| 1.12.0+         | 0.74.0+              |
| 1.10.0+         | 0.73.0+              |
| 1.6.0+          | 0.72.0+              |
| 1.5.0+          | 0.71.0+              |
| 1.3.0+          | 0.70.0+              |
| 1.2.0+          | 0.69.0+              |

### Paper (old) architecture[​](/react-native-keyboard-controller/docs/guides/compatibility.md#paper-old-architecture "Direct link to Paper (old) architecture")

This library supports as minimal `react-native` version as possible. However it was decided to drop a support for some really old versions for better development workflow and future support.

| library version | react-native version |
| --------------- | -------------------- |
| 1.7.0+          | 0.65.0+              |
| 1.0.0+          | 0.62.0+              |

## `react-native-reanimated`[​](/react-native-keyboard-controller/docs/guides/compatibility.md#react-native-reanimated "Direct link to react-native-reanimated")

This library is heavily relies on `react-native-reanimated` primitives to bring advanced concepts for keyboard handling.

The minimum supported version of `react-native-reanimated` is `3.0.0` (as officially supported by `react-native-reanimated` team).

## Third-party libraries compatibility[​](/react-native-keyboard-controller/docs/guides/compatibility.md#third-party-libraries-compatibility "Direct link to Third-party libraries compatibility")

Since this library uses `WindowInsetsCompat` API on Android it may conflict with other libraries if they are using deprecated API (if they are changing `window` flags directly).

For example `react-native-screens` [were](https://github.com/software-mansion/react-native-screens/pull/1451) using old API, so if you are using `StatusBar` management from `react-native-screens` you'll need to use at least `3.14+` version. Otherwise it will **break** keyboard animations.

`StatusBar` component from `react-native` is also using deprecated API. In order to allow better compatibility - `react-native-keyboard-controller` [monkey-patches](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/30) this component (hopefully soon they will change an approach and will rewrite this component to new API).

If you know other 3rd party libraries that may be using deprecated API, please open an [issue](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/new?assignees=kirillzyusko\&labels=bug\&template=bug_report.md\&title=) and we'll try to fix it.
