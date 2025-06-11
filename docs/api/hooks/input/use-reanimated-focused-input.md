# useReanimatedFocusedInput

Hook that returns an information about `TextInput` that currently has a focus. Returns `null` if no input has focus.

Hook will update its value in next cases:

* when keyboard changes its size (appears, disappears, changes size because of different input mode);
* when focus was changed from one `TextInput` to another;
* when `layout` of focused input was changed;
* when user types a text;
* when text selection was changed.

Events order

The value from `useReanimatedFocusedInput` will be always updated before keyboard events, so you can safely read values in `onStart` handler and be sure they are up-to-date.

## Event structure[​](/react-native-keyboard-controller/docs/api/hooks/input/use-reanimated-focused-input.md#event-structure "Direct link to Event structure")

The `input` property from this hook is returned as `SharedValue`. The returned data has next structure:

```
type FocusedInputLayoutChangedEvent = {
  target: number; // tag of the focused TextInput
  parentScrollViewTarget: number; // tag of the parent ScrollView

  // layout of the focused TextInput
  layout: {
    x: number; // `x` coordinate inside the parent component
    y: number; // `y` coordinate inside the parent component
    width: number; // `width` of the TextInput
    height: number; // `height` of the TextInput
    absoluteX: number; // `x` coordinate on the screen
    absoluteY: number; // `y` coordinate on the screen
  };
};
```

## Example[​](/react-native-keyboard-controller/docs/api/hooks/input/use-reanimated-focused-input.md#example "Direct link to Example")

```
const { input } = useReanimatedFocusedInput();
```

Also have a look on [example](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example) app for more comprehensive usage.
