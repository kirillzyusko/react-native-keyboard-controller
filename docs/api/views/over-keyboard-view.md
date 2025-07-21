# OverKeyboardView

<!-- -->

A simple way to display any view over the keyboard without hiding or closing it 🔥. It's perfect for displaying menus, tooltips, custom views, and more. Supports both iOS and Android.

Think of it as an alternative to `Modal`, offering an improved user experience by keeping the keyboard open while the view is displayed.

`KeyboardProvider` presence

This component works independently of `KeyboardProvider`. If you're only using this component from the library, wrapping your entire app in `KeyboardProvider` is not required.

tip

Unlike `Modal` component the `OverKeyboardView` is not supposed to have too many props for customization.

By default it is transparent, it stretches to **full screen** without **any animation** (i. e. `animationType`, `presentationStyle`, `statusBarTranslucent`, `transparent` properties will not be supported). To support effect of these properties you can use third party libraries like `react-native-reanimated` to create custom animations, `react-native-safe-area-context` to handle safe area insets, etc.

## Props[​](/react-native-keyboard-controller/docs/api/views/over-keyboard-view.md#props "Direct link to Props")

### `visible`[​](/react-native-keyboard-controller/docs/api/views/over-keyboard-view.md#visible "Direct link to visible")

A boolean prop indicating whether the view is visible or not. If it's `true` then view is shown on the screen. If it's `false` then view is hidden.

## Example[​](/react-native-keyboard-controller/docs/api/views/over-keyboard-view.md#example "Direct link to Example")

```
import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { OverKeyboardView } from "react-native-keyboard-controller";

export default function OverKeyboardViewExample() {
  const [isShow, setShow] = useState(false);

  return (
    <View>
      <TextInput style={styles.input} testID="over_keyboard_view.input" />
      <Button
        testID="over_keyboard_view.show"
        title="Show"
        onPress={() => setShow(true)}
      />
      <OverKeyboardView visible={isShow}>
        <GestureHandlerRootView style={styles.fullScreen}>
          <TouchableWithoutFeedback
            style={styles.fullScreen}
            testID="over_keyboard_view.background"
            onPress={() => setShow(false)}
          >
            <View style={styles.container}>
              <TouchableOpacity
                testID="over_keyboard_view.content"
                onPress={() => setShow(false)}
              >
                <View style={styles.background} />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </GestureHandlerRootView>
      </OverKeyboardView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  background: {
    width: 200,
    height: 200,
    backgroundColor: "blue",
  },
  input: {
    backgroundColor: "yellow",
    width: 200,
    height: 50,
    alignSelf: "center",
    marginTop: 150,
  },
});
```
