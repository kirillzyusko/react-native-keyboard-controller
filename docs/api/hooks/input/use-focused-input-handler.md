# useFocusedInputHandler

<!-- -->

`useFocusedInputHandler` is a hook that allows to intercept events from a focused `TextInput`.

## Example[​](/react-native-keyboard-controller/docs/api/hooks/input/use-focused-input-handler.md#example "Direct link to Example")

```
useFocusedInputHandler(
  {
    onChangeText: ({ text }) => {
      "worklet";
    },
    onSelectionChange: ({ target, selection }) => {
      "worklet";
    },
  },
  [],
);
```

## Handlers[​](/react-native-keyboard-controller/docs/api/hooks/input/use-focused-input-handler.md#handlers "Direct link to Handlers")

### `onChangeText`[​](/react-native-keyboard-controller/docs/api/hooks/input/use-focused-input-handler.md#onchangetext "Direct link to onchangetext")

Fires an event whenever user changes text in focused `TextInput` (i. e. adds or deletes symbols). Event has following structure:

```
type FocusedInputTextChangedEvent = {
  text: string;
};
```

This handler can be handy when you need to have an access to what user typed on a global level (i. e. when you don't have a direct access to your `TextInput`), for example:

* you develop a generic component for any kind of avoidance focused inputs (i. e. `AwareScrollView`) that doesn't have an access to child `TextInputs` by design;
* you track user activity on the screen and if there is no activity for certain period of time then you do a certain action (logout for example). If you want to reset timer when user interacts with a keyboard - usage of this hook can be a good choice.

### `onSelectionChange`[​](/react-native-keyboard-controller/docs/api/hooks/input/use-focused-input-handler.md#onselectionchange "Direct link to onselectionchange")

Fires an event whenever user selects text in focused `TextInput`. Event has following structure:

```
type FocusedInputSelectionChangedEvent = {
  target: number;
  selection: {
    start: {
      x: number;
      y: number;
      position: number;
    };
    end: {
      x: number;
      y: number;
      position: number;
    };
  };
};
```

This handler can be handy when you need to have an access to input on a global level (i. e. when you don't have a direct access to your `TextInput`) or if you need to have an access to coordinates of text selection (for example to draw a custom element that follows caret position):

<!-- -->

[](/react-native-keyboard-controller/video/selection-demo.mov)
