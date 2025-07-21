# KeyboardGestureArea

`KeyboardGestureArea` allows you to define a region on the screen, where gestures will control the keyboard position.

Platform availability

This component is available only for Android >= 11. For Android < 11 it will render `React.Fragment`.

## Props[​](/react-native-keyboard-controller/docs/api/views/keyboard-gesture-area.md#props "Direct link to Props")

### `offset`[​](/react-native-keyboard-controller/docs/api/views/keyboard-gesture-area.md#offset "Direct link to offset")

Extra distance to the keyboard. Default is `0`.

### `interpolator`[​](/react-native-keyboard-controller/docs/api/views/keyboard-gesture-area.md#interpolator- "Direct link to interpolator-")

String with possible values `linear` and `ios`:

* **ios** - interactive keyboard dismissing will work as in iOS: swipes in non-keyboard area will not affect keyboard positioning, but if your swipe touches keyboard - keyboard will follow finger position.
* **linear** - gestures inside the component will linearly affect the position of the keyboard, i.e. if the user swipes down by 20 pixels, then the keyboard will also be moved down by 20 pixels, even if the gesture was not made over the keyboard area.

### `showOnSwipeUp`[​](/react-native-keyboard-controller/docs/api/views/keyboard-gesture-area.md#showonswipeup- "Direct link to showonswipeup-")

A boolean prop which allows to customize interactive keyboard behavior. If set to `true` then it allows to show keyboard (if it's already closed) by swipe up gesture. `false` by default.

### `enableSwipeToDismiss`[​](/react-native-keyboard-controller/docs/api/views/keyboard-gesture-area.md#enableswipetodismiss- "Direct link to enableswipetodismiss-")

A boolean prop which allows to customize interactive keyboard behavior. If set to `false`, then any gesture will not affect keyboard position if the keyboard is shown. `true` by default.

### `textInputNativeID`[​](/react-native-keyboard-controller/docs/api/views/keyboard-gesture-area.md#textinputnativeid- "Direct link to textinputnativeid-")

A corresponding `nativeID` value from the associated `TextInput` (a string that links the `KeyboardGestureArea` to one or more `TextInput` components). This is **required on iOS** in order to apply the `offset` when the keyboard is shown. Only the currently focused `TextInput` with a matching `nativeID` will receive offset behavior:

* To apply the offset behavior to **multiple inputs**, you must assign the same `nativeID` to each of them.
* If no `textInputNativeID` is provided, `offset` behavior will not be applied.

## Example[​](/react-native-keyboard-controller/docs/api/views/keyboard-gesture-area.md#example "Direct link to Example")

```
<KeyboardGestureArea
  interpolator="ios"
  offset={50}
  textInputNativeID="composer"
>
  <ScrollView keyboardDismissMode="interactive">
    {/* The other UI components of application in your tree */}
  </ScrollView>
  <TextInput nativeID="composer" />
</KeyboardGestureArea>
```

To see full example, check out corresponding [ios](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example/src/screens/Examples/InteractiveKeyboardIOS/index.tsx) and [android](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example/src/screens/Examples/InteractiveKeyboard/index.tsx) examples.
