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
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { KeyboardExtender } from "react-native-keyboard-controller";

export default function KeyboardExtenderExample() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type something..."
        onFocus={() => setKeyboardVisible(true)}
        onBlur={() => setKeyboardVisible(false)}
      />

      <KeyboardExtender enabled={keyboardVisible}>
        <View style={styles.keyboardExtender}>
          <Text style={styles.quickOption}>10$</Text>
          <Text style={styles.quickOption}>20$</Text>
          <Text style={styles.quickOption}>50$</Text>
        </View>
      </KeyboardExtender>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 4,
  },
  keyboardExtender: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    padding: 15,
  },
  quickOption: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
  },
});
```

## Limitations[​](/react-native-keyboard-controller/docs/api/views/keyboard-extender.md#limitations "Direct link to Limitations")

* You can not put `TextInput` inside `KeyboardExtender`. Consider to use [KeyboardBackgroundView](/react-native-keyboard-controller/docs/api/views/keyboard-background-view.md) + [KeyboardStickyView](/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view.md) instead.
