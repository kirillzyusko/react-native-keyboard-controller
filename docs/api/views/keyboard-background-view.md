# KeyboardBackgroundView

<!-- -->

`KeyboardBackgroundView` is a visual-only utility that replicates the background of the system keyboard. It doesn't alter layout or position itself beneath the keyboard — it simply renders a view that seamlessly matches the keyboard’s appearance. By matching this color you can create the illusion that your UI and the keyboard share a single, continuous surface.

Primary Use Case

Use this component when you need your UI elements to appear visually connected to the keyboard - perfect for toolbars, input accessories, or panels that should feel like natural keyboard extensions.

## Key Features[​](/react-native-keyboard-controller/docs/api/views/keyboard-background-view.md#key-features "Direct link to Key Features")

* 🎨 **Background Color Matching**: Automatically aligns with system keyboard colors
* 🖌️ **Visual Continuity**: Creates illusion of shared surfaces during transitions
* ⚡ **Independent Operation**: Functions without requiring a KeyboardProvider

## When to Use[​](/react-native-keyboard-controller/docs/api/views/keyboard-background-view.md#when-to-use "Direct link to When to Use")

Use `KeyboardBackgroundView` when:

* You want to **visually align your UI** with the keyboard’s background.
* You’re implementing **shared element transitions** tied to keyboard state.
* You need **a smooth visual bridge** between your layout and the system keyboard without interfering with keyboard positioning or layout logic.
* You create **shared visual spaces**, ideal for scenarios like search inputs or context-sensitive panels that smoothly connect with keyboard appearance.
* You **visually blend** your UI with the keyboard’s look.

warning

While this component works well in most scenarios, keyboard apps allow users to customize their background color. Since Android/iOS do not expose keyboard background APIs, an exact match isn't always guaranteed.

## Props[​](/react-native-keyboard-controller/docs/api/views/keyboard-background-view.md#props "Direct link to Props")

`KeyboardBackgroundView` forwards all [`View`](https://reactnative.dev/docs/view#props) props, so you can treat it like any standard React Native view.

## Usage[​](/react-native-keyboard-controller/docs/api/views/keyboard-background-view.md#usage "Direct link to Usage")

### Basic[​](/react-native-keyboard-controller/docs/api/views/keyboard-background-view.md#basic "Direct link to Basic")

```
import { KeyboardBackgroundView } from "react-native-keyboard-controller";

export function KeyboardExtension() {
  return <KeyboardBackgroundView style={{ height: 48 }} />;
}
```

### Shared-surface transition (advanced)[​](/react-native-keyboard-controller/docs/api/views/keyboard-background-view.md#shared-surface-transition-advanced "Direct link to Shared-surface transition (advanced)")

```
import React from "react";
import { TextInput, View } from "react-native";
import {
  KeyboardBackgroundView,
  KeyboardStickyView,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ReanimatedBackgroundView = Reanimated.createAnimatedComponent(
  KeyboardBackgroundView,
);
const ReanimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

const KeyboardSharedTransitionExample = () => {
  const { bottom } = useSafeAreaInsets();
  const { progress } = useReanimatedKeyboardAnimation();

  const opacity = useAnimatedStyle(
    () => ({
      height: 291 + 70,
      opacity: progress.value,
    }),
    [],
  );
  const inputColor = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ["#323232", "#474747"],
      ),
    }),
    [],
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#000000",
        flex: 1,
        justifyContent: "flex-end",
      }}
    >
      <KeyboardStickyView offset={{ closed: 291, opened: 291 + bottom }}>
        <ReanimatedBackgroundView style={opacity} />
        <View
          style={{
            marginHorizontal: 30,
            marginVertical: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          }}
        >
          <ReanimatedTextInput
            placeholder="127.0.0.1"
            placeholderTextColor="#ececec"
            style={[
              {
                width: "100%",
                padding: 10,
                borderRadius: 8,
                textAlign: "center",
              },
              inputColor,
            ]}
          />
        </View>
      </KeyboardStickyView>
    </SafeAreaView>
  );
};

export default KeyboardSharedTransitionExample;
```

## See also[​](/react-native-keyboard-controller/docs/api/views/keyboard-background-view.md#see-also "Direct link to See also")

* [`KeyboardStickyView`](/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view.md) – affixes content to the keyboard’s frame.
* [`useReanimatedKeyboardAnimation`](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-reanimated-keyboard-animation.md) – drive your own animations with native‑driven progress values.
