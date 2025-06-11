# First animation

To build your first animation you will need to use two hooks: [useKeyboardAnimation](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-animation.md) or [useReanimatedKeyboardAnimation](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-reanimated-keyboard-animation.md).

Both of them return an object with two properties: `progress` and `height` (depends on the hook used, values will be `Animated.Value` or `Reanimated.SharedValue`).

info

`useKeyboardAnimation` returns Animated values with enabled **Native Driver** (`useNativeDriver: true`). Thus some properties can not be animated, such as `height`, `backgroundColor`, etc.

caution

`useReanimatedKeyboardAnimation` works only with `SharedValues`, i.e. it is not compatible with Reanimated v1 API.

## Example[​](/react-native-keyboard-controller/docs/guides/first-animation.md#example "Direct link to Example")

To see how to use these hooks let's consider example below (for more comprehensive usage you may find an [example](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example) app useful):

```
import React from "react";
import { Animated, StyleSheet, TextInput, View } from "react-native";
import { useKeyboardAnimation } from "react-native-keyboard-controller";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  row: {
    flexDirection: "row",
  },
});

export default function KeyboardAnimation() {
  // 1. we need to use hook to get an access to animated values
  const { height, progress } = useKeyboardAnimation();

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Animated.View
          style={{
            width: 50,
            height: 50,
            backgroundColor: "#17fc03",
            borderRadius: 15,
            // 2. we can apply any transformations we want
            transform: [{ translateY: height }, { scale }],
          }}
        />
      </View>
      <TextInput
        style={{
          width: "100%",
          marginTop: 50,
          height: 50,
          backgroundColor: "yellow",
        }}
      />
    </View>
  );
}
```

info

If you are going to use these Animated values in class components (i.e. without hooks) - you can easily [do](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-animation.md) it. Check out [source](https://github.com/kirillzyusko/react-native-keyboard-controller/blob/cf27eb00877db34b860a04cf52a026110e44b4b3/src/animated.tsx#L46-L51) code - this hook simply changes `softInputMode` and consumes `Context`. Also you may read [architecture](/react-native-keyboard-controller/docs/recipes/architecture.md) deep dive to understand more about how this library works.
