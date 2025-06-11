# KeyboardStickyView

A `KeyboardStickyView` component seamlessly ensures that a designated view sticks to the keyboard's movements, maintaining visibility and interaction. Use it when you want to enhance the user experience by preventing important UI elements from being obscured by the keyboard, creating a smooth and user-friendly interface in your React Native application.

`KeyboardAvoidingView` vs `KeyboardStickyView`

Unlike [KeyboardAvoidingView](/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view.md) the `KeyboardStickyView` just moves the content along with keyboard and not resizing the inner view. Try to compare animations of `KeyboardStickyView` and `KeyboardAvoidingView` to see a difference in details on how it works and which component is suitable for your needs.

<!-- -->

|                                                                           |                                                                |
| ------------------------------------------------------------------------- | -------------------------------------------------------------- |
|                                                                           |                                                                |
| *`KeyboardStickyView` - only footer is moving (container is not resized)* | *`KeyboardAvoidingView` - entire container is getting resized* |

## Example[​](/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view.md#example "Direct link to Example")

```
const offset = { closed: 0, opened: 20 };

const StickyFooter = () => {
  return (
    <KeyboardStickyView offset={offset}>
      <Footer />
    </KeyboardStickyView>
  );
};
```

## Props[​](/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view.md#props "Direct link to Props")

### `enabled`[​](/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view.md#enabled "Direct link to enabled")

A boolean prop indicating whether `KeyboardStickyView` is enabled or disabled. If disabled then view will be moved to its initial position (as keyboard would be closed) and will not react on keyboard movements. Default is `true`.

### `offset`[​](/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view.md#offset "Direct link to offset")

An object containing next properties:

* **closed** - additional offset to the view when keyboard is closed. Default value is `0`.
* **opened** - additional offset to the view when keyboard is opened. Default value is `0`.
