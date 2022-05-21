# react-native-keyboard-controller

Keyboard manager which works in identical way on both iOS and Android.

> **Note**: This library is still in development and in `alpha` stage. So most likely it has bugs/issues - don't hesitate to report if you find them 🙂.

## Demonstration

<img src="./gifs/ios.gif?raw=true">

## Key features

- mapping keyboard appearance to animated values 😎
- missing `keyboardWillShow` / `keyboardWillHide` events are available on Android 😍
- module for changing soft input mode on Android 🤔
- reanimated support 🚀
- interactive keyboard dismissing (planned) 👆📱
- and more is coming... Stay tuned! 😊

## Installation

Install `react-native-keyboard-controller` package from npm:

```sh
yarn add react-native-keyboard-controller
# or
# npm install react-native-keyboard-controller --save
```

## Usage

For more comprehensive usage you can have a look on [example](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example).

Below you can see a short overview of library API:

```js
import {
  KeyboardProvider,
  useKeyboardAnimation,
} from 'react-native-keyboard-controller';

// 1. wrap your app in Provider
<KeyboardProvider>
  <AppContainer />
</KeyboardProvider>

// 2. get animation values where you need them
const { height, progress } = useKeyboardAnimation();

// 3. Animate any elements as you wish :)
<Animated.View
  style={{
    width: 50,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 25,
    // the element will move up with the keyboard
    transform: [{ translateY: height }],
  }}
/>
<Animated.View
  style={{
    width: 50,
    height: 50,
    backgroundColor: 'green',
    borderRadius: 25,
    transform: [
      {
        // or use custom interpolation using `progress`
        translateX: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 100],
        }),
      },
    ],
  }}
/>
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
