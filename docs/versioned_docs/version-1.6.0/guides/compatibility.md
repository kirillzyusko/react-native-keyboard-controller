---
sidebar_position: 4
description: Compatibility of library with different react-native versions and architectures
keywords:
  [react-native-keyboard-controller, compatibility, react-native versions]
---

# Compatibility

## React Native

Starting from `1.2.0` this library adds support for a new architecture called `Fabric`. Since a new architecture is still in adoption stage and it changes some APIs over time - it's highly recommended to use versions which are compatible and were intensively tested against specific `react-native` versions.

Below you can find a table with supported versions:

| library version | react-native version |
| --------------- | -------------------- |
| 1.6.0+          | 0.72.0+              |
| 1.5.0+          | 0.71.0+              |
| 1.3.0+          | 0.70.0+              |
| 1.2.0+          | 0.69.0+              |

:::info

For `Paper` (old) architecture there is no any restrictions. If you found an incompatibility - don't hesitate to open an [issue](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/new?assignees=kirillzyusko&labels=bug&template=bug_report.md&title=). It will help the project 🙏

:::

## Third-party libraries compatibility

Since this library uses `WindowInsetsCompat` API on Android it may conflict with other libraries if they are using deprecated API (if they are changing `window` flags directly).

For example `react-native-screens` [were](https://github.com/software-mansion/react-native-screens/pull/1451) using old API, so if you are using `StatusBar` management from `react-native-screens` you'll need to use at least `3.14+` version. Otherwise it will **break** keyboard animations.

`StatusBar` component from `react-native` is also using deprecated API. In order to allow better compatibility - `react-native-keyboard-controller` [monkey-patches](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/30) this component (hopefully soon they will change an approach and will rewrite this component to new API).

If you know other 3rd party libraries that may be using deprecated API, please open an [issue](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/new?assignees=kirillzyusko&labels=bug&template=bug_report.md&title=) and we'll try to fix it.
