# KeyboardEffects

A `KeyboardEffects` component lets you render arbitrary content — colors, gradients, images, animations — **behind** the keyboard. Rendering an opaque view is enough to give the keyboard a solid, branded background instead of the default system blur. The `translucent` prop goes a step further for *animated* effects — it removes the native blur/backdrop entirely so a moving gradient or Skia shader shows through crisp and unaltered (the same idea behind the Apple Intelligence / Siri keyboard glow).

<!-- -->

[](/react-native-keyboard-controller/pr-preview/pr-1535/video/keyboard-effects.webm)

iOS only

The translucent keyboard is an iOS capability. On other platforms the `translucent` prop is a no-op (the system keyboard is opaque, so content rendered behind it will not be visible).

## Example[​](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/components/keyboard-effects.md#example "Direct link to Example")

```
import { KeyboardEffects } from "react-native-keyboard-controller";
import { View } from "react-native";

const Effect = () => {
  return (
    <KeyboardEffects>
      <View style={{ flex: 1, backgroundColor: "purple" }} />
    </KeyboardEffects>
  );
};
```

For a full "AI keyboard" example (an animated gradient bleeding through the keyboard plus a glowing input) see the `AIKeyboard` screen in the [example app](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example/src/screens/Examples/AIKeyboard).

## Props[​](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/components/keyboard-effects.md#props "Direct link to Props")

### [`View Props`](https://reactnative.dev/docs/view#props)[​](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/components/keyboard-effects.md#view-props "Direct link to view-props")

Inherits [View Props](https://reactnative.dev/docs/view#props).

### [`KeyboardStickyViewProps`](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/components/keyboard-sticky-view.md)[​](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/components/keyboard-effects.md#keyboardstickyviewprops "Direct link to keyboardstickyviewprops")

Inherits [KeyboardStickyViewProps](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/components/keyboard-sticky-view.md).

### `translucent`[​](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/components/keyboard-effects.md#translucent "Direct link to translucent")

A boolean prop indicating whether the keyboard backdrop should be translucent. When `true`, the system keyboard becomes translucent so the content rendered inside `KeyboardEffects` blends through it. When `false` (default), the keyboard stays opaque. Default is `false`.

Multiple instances

Multiple mounted `KeyboardEffects` instances share a single native keyboard state, reconciled the same way React Native's `StatusBar` reconciles multiple instances: each instance's `translucent` value sits on a shared stack, and whichever instance was mounted (or updated) most recently wins. When that instance unmounts, the keyboard falls back to the value of the next-most-recently-mounted instance still on screen — not straight to opaque.
