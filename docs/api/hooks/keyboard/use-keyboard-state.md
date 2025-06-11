# useKeyboardState

`useKeyboardState` is a hook which gives an access to current keyboard state. This hook combines data from `KeyboardController.state()` and `KeyboardController.isVisible()` methods and makes it reactive (i. e. triggers a re-render when keyboard state/visibility has changed).

warning

Use this hook only when you need to control `props` of views returned in JSX-markup. If you need to access the keyboard `state` in callbacks or event handlers then consider to use [KeyboardController.state()](/react-native-keyboard-controller/docs/api/keyboard-controller.md#state) or [KeyboardController.isVisible()](/react-native-keyboard-controller/docs/api/keyboard-controller.md#isvisible) methods instead. This allows you to retrieve values as needed without triggering unnecessary re-renders.

✅ Recommended 👍

```
// use KeyboardController.isVisible()

<Button
  onPress={() => {
    // read value on demand
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
    // don't consume state from hook
    if (isVisible) {
      // ...
    }
  }}
>
  Go to next Page
</Button>;
```

tip

Also make sure that if you need to change style based on keyboard presence then you are using corresponding [animated](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-animation.md) hooks to offload animation to a native thread and free up resources for JS thread.

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

## Example[​](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-state.md#example "Direct link to Example")

```
import { View, Text, StyleSheet } from "react-native";
import { useKeyboardState } from "react-native-keyboard-controller";

const ShowcaseComponent = () => {
  const { isVisible } = useKeyboardState();

  return (
    <View style={isVisible ? styles.highlighted : null}>
      <Text>Address form</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  highlighted: {
    borderColor: "#0070D8",
  },
});
```

Also have a look on [example](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example) app for more comprehensive usage.
