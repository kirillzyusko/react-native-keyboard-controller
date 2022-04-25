# react-native-keyboard-controller

Platform agnostic keyboard manager

## Installation

The module is not available on `npm`, but you can install it from github.

```sh
yarn add https://github.com/kirillzyusko/react-native-keyboard-controller
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

// 3. Animate as you wish :)
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
