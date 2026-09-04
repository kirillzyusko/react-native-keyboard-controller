# KeyboardStickyView

A `KeyboardStickyView` component seamlessly ensures that a designated view sticks to the keyboard's movements, maintaining visibility and interaction. Often referred to as a **keyboard accessory** or **keyboard accessory view**, it helps you enhance the user experience by preventing important UI elements from being obscured by the keyboard, creating a smooth and user-friendly interface in your React Native application.

`KeyboardAvoidingView` vs `KeyboardStickyView`

Unlike [KeyboardAvoidingView](/react-native-keyboard-controller/pr-preview/pr-1624/docs/api/components/keyboard-avoiding-view.md) the `KeyboardStickyView` just moves the content along with keyboard and not resizing the inner view. Try to compare animations of `KeyboardStickyView` and `KeyboardAvoidingView` to see a difference in details on how it works and which component is suitable for your needs.

<!-- -->

|                                                                           |                                                                |
| ------------------------------------------------------------------------- | -------------------------------------------------------------- |
|                                                                           |                                                                |
| *`KeyboardStickyView` - only footer is moving (container is not resized)* | *`KeyboardAvoidingView` - entire container is getting resized* |

## Example[​](/react-native-keyboard-controller/pr-preview/pr-1624/docs/api/components/keyboard-sticky-view.md#example "Direct link to Example")

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

## Props[​](/react-native-keyboard-controller/pr-preview/pr-1624/docs/api/components/keyboard-sticky-view.md#props "Direct link to Props")

### `enabled`[​](/react-native-keyboard-controller/pr-preview/pr-1624/docs/api/components/keyboard-sticky-view.md#enabled "Direct link to enabled")

A boolean prop indicating whether `KeyboardStickyView` is enabled or disabled. If disabled then view will be moved to its initial position (as keyboard would be closed) and will not react on keyboard movements. Default is `true`.

### `offset`[​](/react-native-keyboard-controller/pr-preview/pr-1624/docs/api/components/keyboard-sticky-view.md#offset "Direct link to offset")

An object containing next properties:

* **closed** - additional offset to the view when keyboard is closed. Default value is `0`.
* **opened** - additional offset to the view when keyboard is opened. Default value is `0`.

## Troubleshooting[​](/react-native-keyboard-controller/pr-preview/pr-1624/docs/api/components/keyboard-sticky-view.md#troubleshooting "Direct link to Troubleshooting")

### Missing animations on iOS (new arch only)[​](/react-native-keyboard-controller/pr-preview/pr-1624/docs/api/components/keyboard-sticky-view.md#missing-animations-on-ios-new-arch-only "Direct link to Missing animations on iOS (new arch only)")

Starting with version `1.21.7`, `KeyboardStickyView` uses Reanimated for its `translateY` animation. On iOS (New Architecture only), updating React state right before a keyboard event can cause this animation to be skipped entirely. This happens because a React commit can block Reanimated from applying its animated updates in the same frame.

Common triggers include:

* updating state in the `onFocus` callback of a `TextInput`;
* updating state in response to the `keyboardWillShow` event;
* using `KeyboardToolbar` or other components that trigger a state update before the keyboard appears.

To fix this, enable the [DISABLE\_COMMIT\_PAUSING\_MECHANISM](https://docs.swmansion.com/react-native-reanimated/docs/guides/feature-flags/#disable_commit_pausing_mechanism) feature flag. See the link for detailed setup instructions.

Do I need to enable this flag?

This issue can occur even if the state update comes from a different screen (e.g. a parent navigator). To check, open the React Profiler and look for any React commits that happen just before the keyboard event — if you see one, you likely need this flag.
