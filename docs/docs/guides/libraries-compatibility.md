---
sidebar_position: 2
---

# Third-party libraries compatibility

Since this library uses `WindowInsetsCompat` API on Android it may conflict with other libraries if they are using deprecated API (if they are changing `window` flags directly).

For example `react-native-screens` [were](https://github.com/software-mansion/react-native-screens/pull/1451) using old API, so if you are using `StatusBar` management from `react-native-screens` you'll need to use at least `3.14+` version. Otherwise it will **break** keyboard animations.

`StatusBar` component from `react-native` is also using deprecated API. In order to allow better compatibility - `react-native-keyboard-controller` [monkey-patches](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/30) this component (hopefully soon they will change an approach and will rewrite this component to new API).

If you know other 3rd party libraries that may be using deprecated API, please open an issue and we'll try to fix it.