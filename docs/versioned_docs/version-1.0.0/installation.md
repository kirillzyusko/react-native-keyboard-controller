---
sidebar_position: 1
---

# Installation

## Adding a library to the project

Install the `react-native-keyboard-controller` package in your React Native project.

```bash
yarn add react-native-keyboard-controller
# or with npm
# npm install react-native-keyboard-controller --save
```

### Linking

This package supports [autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

:::tip Pods update

Don't forget to re-install `pods` after adding the package and don't forget to re-assemble `android` and `ios` applications, since this library contains native code.

:::

### Expo

This library has native code, so it does not work with _Expo Go_ but you can easily install it using a [custom dev client](https://docs.expo.dev/development/getting-started/).

## Adding provider

In order to use it you'll need to wrap your app with `KeyboardProvider` component. 

:::info Why it's needed?

If you are bothered why it's needed, you can read more about it in [architecture](./recipes/platform-differences.md) deep dive to understand all aspects of how this library works.

:::

```tsx
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function App() {
  return (
    <KeyboardProvider>
      // your code here
    </KeyboardProvider>
  );
}
```

Congratulations! 🎉 You've just finished installation process. Go to the [next section](./guides/first-animation.md) to get more insights of what you can do using this library. 😎