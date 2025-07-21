# useKeyboardState

`useKeyboardState` is a hook which gives an access to current keyboard state. This hook combines data from `KeyboardController.state()` and `KeyboardController.isVisible()` methods and makes it reactive (i. e. triggers a re-render when keyboard state/visibility has changed).

warning

Don’t use `state` from `useKeyboardState` inside event handlers. It will cause unnecessary re-renders. See [common pitfalls](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-state.md#-common-pitfalls) section for more details and alternatives.

tip

Make sure that if you want to animate something based on keyboard presence then you've seen [optimize animation](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-state.md#%EF%B8%8F-optimize-animations-with-native-threads) section.

`useKeyboardState` allows you to pass a **selector** function to pick only the necessary part of the keyboard state data. This is a powerful technique to prevent unnecessary re-renders of your component when only a specific property of the keyboard state changes.

```
const appearance = useKeyboardState((state) => state.appearance);
```

In this example, your component will only re-render when the `appearance` property of the `KeyboardState` changes, rather than for any change in the entire state object.

## Data structure[​](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-state.md#data-structure "Direct link to Data structure")

The `KeyboardState` is represented by following structure:

```
type KeyboardState = {
  isVisible: boolean;
  height: number;
  duration: number; // duration of the animation
  timestamp: number; // timestamp of the event from native thread
  target: number; // tag of the focused `TextInput`
  type: string; // `keyboardType` property from focused `TextInput`
  appearance: string; // `keyboardAppearance` property from focused `TextInput`
};
```

## 🚫 Common Pitfalls[​](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-state.md#-common-pitfalls "Direct link to 🚫 Common Pitfalls")

### ⚠️ Avoid Unnecessary Re-renders[​](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-state.md#️-avoid-unnecessary-re-renders "Direct link to ⚠️ Avoid Unnecessary Re-renders")

If you need to access the keyboard `state` in callbacks or event handlers then consider to use [KeyboardController.state()](/react-native-keyboard-controller/docs/api/keyboard-controller.md#state) or [KeyboardController.isVisible()](/react-native-keyboard-controller/docs/api/keyboard-controller.md#isvisible) methods instead. This allows you to retrieve values as needed without triggering unnecessary re-renders.

✅ Recommended 👍

```
// use KeyboardController.isVisible()

<Button
  onPress={() => {
    // ✅ read value on demand
    if (KeyboardController.isVisible()) {
      // ...
    }
  }}
>
  Go to Next Page
</Button>
```

❌ Not recommended 🙅‍♂️

```
const { isVisible } = useKeyboardState();

<Button
  onPress={() => {
    // ❌ don't consume state from hook
    if (isVisible) {
      // ...
    }
  }}
>
  Go to next Page
</Button>;
```

### ⚡️ Optimize Animations with Native Threads[​](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-state.md#️-optimize-animations-with-native-threads "Direct link to ⚡️ Optimize Animations with Native Threads")

Don't use `useKeyboardState` for controlling styles, because:

* applying it directly to styles can lead to choppy animations;
* it changes its values frequently making excessive re-renders on each keyboard state change.

If you need to change styles then you can use "animated" hooks such as [useKeyboardAnimation](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-animation.md), [useReanimatedKeyboardAnimation](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-reanimated-keyboard-animation.md) or even [useKeyboardHandler](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-handler.md) to offload animation to a native thread and free up resources for JS thread.

✅ Recommended 👍

```
const { height } = useKeyboardAnimation();

<Animated.View
  style={{
    width: "100%",
    transform: [{ translateY: height }],
  }}
>
  ...
</Animated.View>;
```

❌ Not recommended 🙅‍♂️

```
const { height } = useKeyboardState();

<View
  style={{
    width: "100%",
    transform: [{ translateY: height }],
  }}
>
  ...
</View>;
```

## Example[​](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-state.md#example "Direct link to Example")

```
import { View, Text, StyleSheet } from "react-native";
import { useKeyboardState } from "react-native-keyboard-controller";

const ShowcaseComponent = () => {
  const isVisible = useKeyboardState((state) => state.isVisible);

  return isVisible ? (
    <View style={styles.highlighted}>
      <Text>Address form</Text>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  highlighted: {
    borderColor: "#0070D8",
  },
});
```

Also have a look on [example](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example) app for more comprehensive usage.
