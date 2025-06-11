# Installation

## Adding a library to the project[​](/react-native-keyboard-controller/docs/installation.md#adding-a-library-to-the-project "Direct link to Adding a library to the project")

Install the `react-native-keyboard-controller` package in your React Native project.

* YARN
* NPM
* EXPO

```
yarn add react-native-keyboard-controller
```

```
npm install react-native-keyboard-controller --save
```

```
npx expo install react-native-keyboard-controller
```

Only Expo Dev client compatible

This library has native code, so it **does not work** with *Expo Go* but it's fully compatible with [custom dev client](https://docs.expo.dev/development/getting-started/).

Mandatory `react-native-reanimated` dependency

This library requires `react-native-reanimated` to work properly. If you don't have it in your project, you need to follow [installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/#installation) and install it in your project before using this library.

### Linking[​](/react-native-keyboard-controller/docs/installation.md#linking "Direct link to Linking")

This package supports [autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

Pods update

After adding the package don't forget to **re-install** `pods` and **re-assemble** `android` and `ios` applications, since this library contains native code.

If you still experience issues like **package doesn't seem to be linked** try performing a [fresh build](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/786#issuecomment-2741464142) to clear any outdated cache.

## Adding provider[​](/react-native-keyboard-controller/docs/installation.md#adding-provider "Direct link to Adding provider")

In order to use it you'll need to wrap your app with `KeyboardProvider` component.

Why it's needed?

If you are bothered why it's needed, you can read more about it in [architecture](/react-native-keyboard-controller/docs/recipes/platform-differences.md) deep dive to understand all aspects of how this library works.

```
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function App() {
  return (
    <KeyboardProvider>
      {/* your main application code goes here */}
    </KeyboardProvider>
  );
}
```

Congratulations! 🎉 You've just finished installation process. Go to the [next section](/react-native-keyboard-controller/docs/guides/first-animation.md) to get more insights of what you can do using this library. 😎

Troubleshooting guide

If you encounter some issues make sure to read the [Troubleshooting](/react-native-keyboard-controller/docs/troubleshooting.md) section.
