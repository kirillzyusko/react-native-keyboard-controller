# KeyboardController

The `KeyboardController` module in React Native provides a convenient set of methods for managing the behavior of the keyboard. With seamless runtime adjustments, this module allows developers to dynamically change the `windowSoftInputMode` on Android and dismiss the keyboard on both platforms.

## Methods[​](/react-native-keyboard-controller/docs/api/keyboard-controller.md#methods "Direct link to Methods")

### `setInputMode`[​](/react-native-keyboard-controller/docs/api/keyboard-controller.md#setinputmode- "Direct link to setinputmode-")

```
static setInputMode(mode: AndroidSoftInputModes): void;
```

This method is used to dynamically change the `windowSoftInputMode` (`softwareKeyboardLayoutMode` in Expo terminology) during runtime in an Android application. It takes an argument that specifies the desired input mode. The example provided sets the input mode to `SOFT_INPUT_ADJUST_RESIZE`:

```
KeyboardController.setInputMode(AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE);
```

Understanding how different modes works

To understand the difference between `adjustResize`/`adjustPan`/`adjustNothing` behavior you can look into this [post](https://stackoverflow.com/a/71301500/9272042).

info

A combination of `adjustResize` + `edge-to-edge` mode will result in behavior similar to `adjustNothing` - in this case window is not resized automatically and content is not moved along with the keyboard position. And it becomes a responsibility of developer to handle keyboard appearance (thus it'll match iOS behavior).

### `setDefaultMode`[​](/react-native-keyboard-controller/docs/api/keyboard-controller.md#setdefaultmode- "Direct link to setdefaultmode-")

```
static setDefaultMode(): void;
```

This method is used to restore the default `windowSoftInputMode` (`softwareKeyboardLayoutMode` in Expo terminology) declared in the `AndroidManifest.xml` (or `app.json` in Expo case). It resets the input mode to the default value:

```
KeyboardController.setDefaultMode();
```

### `dismiss`[​](/react-native-keyboard-controller/docs/api/keyboard-controller.md#dismiss "Direct link to dismiss")

```
static dismiss(options?: DismissOptions): Promise<void>;
```

This method is used to hide the keyboard. It triggers the dismissal of the keyboard. The method returns promise that will be resolved only when keyboard is fully hidden (if keyboard is already hidden it will resolve immediately):

```
await KeyboardController.dismiss();
```

If you want to hide a keyboard and keep focus then you can pass `keepFocus` option:

```
await KeyboardController.dismiss({ keepFocus: true });
```

What is the difference comparing to `react-native` implementation?

The equivalent method from `react-native` relies on specific internal components, such as `TextInput`, and may not work as intended if a custom input component is used.

In contrast, the described method enables keyboard dismissal for any focused input, extending functionality beyond the limitations of the default implementation.

### `isVisible`[​](/react-native-keyboard-controller/docs/api/keyboard-controller.md#isvisible "Direct link to isvisible")

```
static isVisible(): boolean;
```

This method returns `true` if keyboard is currently visible and `false` otherwise.

```
if (KeyboardController.isVisible()) {
  // do something
}
```

### `state`[​](/react-native-keyboard-controller/docs/api/keyboard-controller.md#state "Direct link to state")

```
static state(): KeyboardEventData;
```

This method returns the last keyboard state.

The `KeyboardEventData` is represented by following structure:

```
type KeyboardEventData = {
  height: number;
  duration: number; // duration of the animation
  timestamp: number; // timestamp of the event from native thread
  target: number; // tag of the focused `TextInput`
  type: string; // `keyboardType` property from focused `TextInput`
  appearance: string; // `keyboardAppearance` property from focused `TextInput`
};
```

### `setFocusTo`[​](/react-native-keyboard-controller/docs/api/keyboard-controller.md#setfocusto "Direct link to setfocusto")

```
static setFocusTo(direction: "prev" | "current" | "next"): void;
```

This method sets focus to the selected field. Possible values:

* `prev` - set focus to the previous field;
* `current` - set focus to the last focused field (i. e. if keyboard was closed you can restore focus);
* `next` - set focus to the next field.

```
KeyboardController.setFocusTo("next");
```
