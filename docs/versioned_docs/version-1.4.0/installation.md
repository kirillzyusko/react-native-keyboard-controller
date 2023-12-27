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
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function App() {
  return (
    <KeyboardProvider>
      {/* your main application code goes here */}
    </KeyboardProvider>
  );
}
```

Congratulations! 🎉 You've just finished installation process. Go to the [next section](./guides/first-animation.md) to get more insights of what you can do using this library. 😎

## Troubleshooting

### Incompatible `kotlinVersion` and failed Android builds

Sometimes you may see failed Android builds complaining that your version of kotlin is lower than expected version.

`error: module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.6.0, expected version is 1.4.1.`

To overcome this issue you will need to set higher version of the kotlin:

#### react-native or expo bare workflow

You need to modify `android/build.gradle` and specify correct `kotlinVersion`:

```java
buildscript {
    ext {
        kotlinVersion = "1.6.21"
    }
}
```

For more information please, see how it's configured in [example](https://github.com/kirillzyusko/react-native-keyboard-controller/blob/9d0e63712a2f55dab0f6f3f95398567bb9ca1efa/example/android/build.gradle#L9) project.

#### Expo managed workflow

If you are using Expo managed workflow you need to install `expo-build-properties`

```sh
npx expo install expo-build-properties
```

And add plugin inside of your `app.json` or `app.config.js` with following configuration:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "kotlinVersion": "1.6.21"
          }
        }
      ]
    ]
  }
}
```

### Swift support

Since part of this library is written using `swift` language - your project needs to support it. For that you can create empty `.swift` file with bridging header. See this [step-by-step](https://stackoverflow.com/a/56176956/9272042) guide if you have problems.
