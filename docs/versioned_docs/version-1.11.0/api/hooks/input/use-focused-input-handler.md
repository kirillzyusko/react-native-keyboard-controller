---
keywords:
  [
    react-native,
    react native,
    react-native-keyboard-controller,
    useFocusedInputHandler,
    onTextChanged,
    onChangeText,
    input interceptor,
    react-native-reanimated,
    worklet,
    react hook,
  ]
---

# useFocusedInputHandler

`useFocusedInputHandler` is a hook that allows to intercept events from a focused `TextInput`.

## Example

```ts
useFocusedInputHandler(
  {
    onChangeText: ({ text }) => {
      "worklet";
    },
  },
  [],
);
```

## Handlers

### `onChangeText`

Fires an event whenever user changes text in focused `TextInput` (i. e. adds or deletes symbols). Event has following structure:

```ts
type FocusedInputTextChangedEvent = {
  text: string;
};
```

This handler can be handy when you need to have an access to what user typed on a global level (i. e. when you don't have a direct access to your `TextInput`), for example:

- you develop a generic component for any kind of avoidance focused inputs (i. e. `AwareScrollView`) that doesn't have an access to child `TextInputs` by design;
- you track user activity on the screen and if there is no activity for certain period of time then you do a certain action (logout for example). If you want to reset timer when user interacts with a keyboard - usage of this hook can be a good choice.

## Known issues

- [react-native-text-input-mask#305](https://github.com/react-native-text-input-mask/react-native-text-input-mask/pull/305): `onChangeText` handler ignores an input from `react-native-text-input-mask` on `iOS`
