# KeyboardAvoidingView

This component will automatically adjust its height, position, or bottom padding based on the keyboard height to remain visible while the virtual keyboard is displayed.

## Why another `KeyboardAvoidingView` is needed?[​](/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view.md#why-another-keyboardavoidingview-is-needed "Direct link to why-another-keyboardavoidingview-is-needed")

This new `KeyboardAvoidingView` maintains the familiar React Native [API](https://reactnative.dev/docs/keyboardavoidingview) but ensures consistent behavior and animations on both `iOS` and `Android` platforms. Unlike the existing solution, which primarily caters to `iOS`, this component eliminates platform discrepancies, providing a unified user experience. By reproducing the same animations and behaviors on both platforms, it simplifies cross-platform development, meets user expectations for consistency, and enhances code maintainability. Ultimately, it addresses the need for a reliable and uniform keyboard interaction solution across different devices.

Below is a visual difference between the implementations (the animation is ***4x*** times slower for better visual perception).

<!-- -->

|                                                    |                                                                                 |
| -------------------------------------------------- | ------------------------------------------------------------------------------- |
|                                                    |                                                                                 |
| *Default `react-native` implementation on Android* | *Implementation from `react-native-keyboard-controller` with better animations* |

Found a bug? Help the project and report it!

If you found any bugs or inconsistent behavior comparing to `react-native` implementation - don't hesitate to open an [issue](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/new?assignees=kirillzyusko\&labels=bug\&template=bug_report.md\&title=). It will help the project 🙏

Also if there is any well-known problems in original `react-native` implementation which can not be fixed for a long time and they are present in this implementation as well - also feel free to submit an [issue](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/new?assignees=kirillzyusko\&labels=bug\&template=bug_report.md\&title=). Let's make this world better together 😎

## Example[​](/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view.md#example "Direct link to Example")

```
import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function KeyboardAvoidingViewExample() {
  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={100}
      style={styles.content}
    >
      <View style={styles.inner}>
        <Text style={styles.heading}>Header</Text>
        <View>
          <TextInput placeholder="Username" style={styles.textInput} />
          <TextInput placeholder="Password" style={styles.textInput} />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    maxHeight: 600,
  },
  heading: {
    fontSize: 36,
    marginBottom: 48,
    fontWeight: "600",
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-between",
  },
  textInput: {
    height: 45,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 36,
    paddingLeft: 10,
  },
  button: {
    marginTop: 12,
    height: 45,
    borderRadius: 10,
    backgroundColor: "rgb(40, 64, 147)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "500",
    fontSize: 16,
    color: "white",
  },
});
```

## Props[​](/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view.md#props "Direct link to Props")

### [`View Props`](https://reactnative.dev/docs/view#props)[​](/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view.md#view-props "Direct link to view-props")

Inherits [View Props](https://reactnative.dev/docs/view#props).

### `behavior`[​](/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view.md#behavior "Direct link to behavior")

Specify how to react to the presence of the keyboard. Could be one value of:

* `translate-with-padding` - Combines **translation** (moves the view up) with **paddingTop** that gets applied only once per animation. As a result this mode delivers **the best** possible performance. An ideal fit for building **chat-like** apps.

* `padding` - the most commonly used mode. It moves the view up by the height of the keyboard and applies `paddingBottom` to the content container. Use `padding` mode when you have a `ScrollView` or `flex-based` layouts that should remain visible.

* `height` - use this when you want to shrink the entire view rather than moving specific elements.

* `position` - use it when the view needs to shift up instead of resizing. For example when you have a fixed button at the bottom (also be sure that you checked out [KeyboardStickyView](/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view.md) component).

### `contentContainerStyle`[​](/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view.md#contentcontainerstyle "Direct link to contentcontainerstyle")

The style of the content container (View) when behavior is `position`.

### `enabled`[​](/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view.md#enabled "Direct link to enabled")

A boolean prop indicating whether `KeyboardAvoidingView` is enabled or disabled. Default is `true`.

### `keyboardVerticalOffset`[​](/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view.md#keyboardverticaloffset "Direct link to keyboardverticaloffset")

This is the distance between the top of the user screen and the react native view. This is particularly useful when there are fixed headers, navigation bars, or other UI elements at the top of the screen. Default is `0`.

<!-- -->

When to use `keyboardVerticalOffset`?

You should use `keyboardVerticalOffset` in the following scenarios:

* **Navigation Bars / Headers** - If your screen is inside a `Stack.Navigator` from `react-navigation`, the header height should be compensated using `keyboardVerticalOffset`:

```
import { useHeaderHeight } from "@react-navigation/elements";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

const MyScreen = () => {
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <TextInput placeholder="Type here..." />
    </KeyboardAvoidingView>
  );
};
```

* **Custom Toolbars or Fixed Elements at the Top** - If your app has a fixed toolbar, status bar, or other UI elements at the top, you should offset accordingly.

* **Modal Screens with Different Layouts** - When using `KeyboardAvoidingView` inside a `Modal`, you may need to manually define the vertical offset to account for the modal’s positioning.

Below shown a visual representation of `keyboardVerticalOffset`:

Handling `StatusBar` height on Android with `useHeaderHeight`

On `Android`, how you handle the `StatusBar` height depends on whether the `StatusBar` is **translucent** or **not**:

* **If the `StatusBar` is translucent**, `react-navigation` **automatically includes the `StatusBar` height** in `useHeaderHeight()`, along with safe-area padding. This behavior aligns with iOS, so you don’t need to manually add the `StatusBar` height.
* **If the StatusBar is not translucent**, `useHeaderHeight()` does **not** include the `StatusBar` height. In this case, you need to add it manually:

```
const headerHeight = useHeaderHeight() + (StatusBar.currentHeight ?? 0);
```

Since `StatusBar.currentHeight` is an **Android-only** property, using `?? 0` ensures it doesn’t cause issues on iOS. This approach avoids the need for `Platform.OS` or `Platform.select` checks.
