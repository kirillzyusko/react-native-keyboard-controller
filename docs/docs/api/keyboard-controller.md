---
sidebar_position: 5
keywords:
  [
    react-native-keyboard-controller,
    react-native,
    KeyboardController,
    module,
    dismiss,
    dismiss keyboard,
    windowSoftInputMode,
    adjustResize,
    adjustPan,
  ]
---

# KeyboardController

The `KeyboardController` module in React Native provides a convenient set of methods for managing the behavior of the keyboard. With seamless runtime adjustments, this module allows developers to dynamically change the `windowSoftInputMode` on Android and dismiss the keyboard on both platforms.

## Methods

### `setInputMode`

This method is used to dynamically change the `windowSoftInputMode` during runtime in an Android application. It takes an argument that specifies the desired input mode. The example provided sets the input mode to `SOFT_INPUT_ADJUST_RESIZE`:

```ts
KeyboardController.setInputMode(AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE);
```

### `setDefaultMode`

This method is used to restore the default `windowSoftInputMode` declared in the `AndroidManifest.xml`. It resets the input mode to the default value:

```ts
KeyboardController.setDefaultMode();
```

### `dismiss`

This method is used to hide the keyboard. It triggers the dismissal of the keyboard:

```ts
KeyboardController.dismiss();
```

:::info What is the difference comparing to `react-native` implementation?
The equivalent method from `react-native` relies on specific internal components, such as `TextInput`, and may not work as intended if a custom input component is used.

In contrast, the described method enables keyboard dismissal for any focused input, extending functionality beyond the limitations of the default implementation.
:::

### `setFocusTo`

This method moves focus to the next or to the previous input:

```ts
setFocusTo("next");
// or
setFocusTo("prev");
```
