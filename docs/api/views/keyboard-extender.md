# KeyboardExtender

<!-- -->

The `KeyboardExtend` component allows you to extend the keyboard with your own UI that extends the keyboard (i. e. literally increasing its height) moves and matches its appearance.

## `KeyboardStickyView` vs `KeyboardExtender`[​](/react-native-keyboard-controller/docs/api/views/keyboard-extender.md#keyboardstickyview-vs-keyboardextender "Direct link to keyboardstickyview-vs-keyboardextender")

While both components serve similar purposes they are intended for different use cases. Below is the table that can help you to decide which component to use:

| Feature                       | KeyboardExtender | KeyboardStickyView |
| ----------------------------- | ---------------- | ------------------ |
| Matches keyboard design       | ✅               | ❌                 |
| Is part of the keyboard       | ✅               | ❌                 |
| Hides when keyboard is hidden | ✅               | ❌                 |
| Increases keyboard height     | ✅               | ❌                 |

## Features[​](/react-native-keyboard-controller/docs/api/views/keyboard-extender.md#features "Direct link to Features")

* ✅ **Automatically attaches** to all `TextInput`s when enabled
* 📏 **Automatically calculates its height** based on content
* 🎯 **Moves with the keyboard animation**
* 🎨 **Matches the keyboard UI** for seamless integration
* 🎭 **Renders as if it's part of the keyboard**

## Props[​](/react-native-keyboard-controller/docs/api/views/keyboard-extender.md#props "Direct link to Props")

### `enabled`[​](/react-native-keyboard-controller/docs/api/views/keyboard-extender.md#enabled "Direct link to enabled")

A boolean prop indicating whether the component is enabled or disabled. If it's `true`, the component attaches to the keyboard. If it's `false`, it detaches.

## Usage[​](/react-native-keyboard-controller/docs/api/views/keyboard-extender.md#usage "Direct link to Usage")

```
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  KeyboardExtender,
  useKeyboardState,
} from "react-native-keyboard-controller";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KeyboardExtendExample() {
  const appearance = useKeyboardState((state) => state.appearance);
  const [showExtend, setShowExtend] = useState(true);
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.set(withTiming(showExtend ? 1 : 0));
  }, [showExtend]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
    }),
    [],
  );
  const textStyle = useMemo(
    () => [
      styles.priceText,
      appearance === "light"
        ? styles.lightKeyboardText
        : styles.darkKeyboardText,
    ],
    [appearance],
  );

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView edges={["top"]} style={styles.container}>
          <TextInput
            keyboardType="numeric"
            placeholder="Donation amount"
            placeholderTextColor="#5c5c5c"
            style={styles.input}
            onFocus={() => setShowExtend(true)}
          />
          <TextInput
            keyboardType="numeric"
            placeholder="Postal code"
            placeholderTextColor="#5c5c5c"
            style={styles.input}
            onFocus={() => setShowExtend(false)}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <KeyboardExtender enabled={showExtend}>
        <Reanimated.View style={[styles.keyboardExtend, animatedStyle]}>
          <TouchableOpacity onPress={() => Alert.alert("10 dollars")}>
            <Text style={textStyle}>10$</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("20 dollars")}>
            <Text style={textStyle}>20$</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("50 dollars")}>
            <Text style={textStyle}>50$</Text>
          </TouchableOpacity>
        </Reanimated.View>
      </KeyboardExtender>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  input: {
    height: 40,
    borderWidth: 2,
    borderColor: "#1c1c1c",
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  keyboardExtend: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "600",
    padding: 20,
  },
  lightKeyboardText: {
    color: "black",
  },
  darkKeyboardText: {
    color: "white",
  },
});
```

## Limitations[​](/react-native-keyboard-controller/docs/api/views/keyboard-extender.md#limitations "Direct link to Limitations")

* You can not put `TextInput` inside `KeyboardExtender`. Consider to use [KeyboardBackgroundView](/react-native-keyboard-controller/docs/api/views/keyboard-background-view.md) + [KeyboardStickyView](/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view.md) instead.
