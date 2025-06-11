# KeyboardToolbar

`KeyboardToolbar` is a view that sticky to the keyboard and has **next** and **previous** buttons for switching between inputs as well as **Done** button for closing the keyboard.

This component is fully customizable and allows you to define any behavior for provided buttons and also allows you to render additional content.

<!-- -->

## Features[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#features "Direct link to Features")

* **Fully customizable UI** 🎨: Tailor the appearance of the toolbar to match your app's design.
* **Supports dark/light theme** 🌓: Adapts to the theme settings of the user's device for a seamless experience.
* **Extended accessibility support** 🔍: Ensures that all users, including those with disabilities, can navigate through inputs effectively.
* **Full control over the buttons behavior** 🔧: Customize the actions triggered by the next, previous, and done buttons according to your needs.
* **Extends ViewProps** 📜: Supports all the props that `View` component has.

## Props[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#props "Direct link to Props")

### [`View Props`](https://reactnative.dev/docs/view#props)[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#view-props "Direct link to view-props")

Inherits [View Props](https://reactnative.dev/docs/view#props).

### [`KeyboardStickyViewProps`](/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view.md)[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#keyboardstickyviewprops "Direct link to keyboardstickyviewprops")

Inherits [KeyboardStickyViewProps](/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view.md).

### `button`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#button "Direct link to button")

This property allows to render custom touchable component for next, previous and done button.

```
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  KeyboardToolbar,
  KeyboardToolbarProps,
} from "react-native-keyboard-controller";

const CustomButton: KeyboardToolbarProps["button"] = ({
  children,
  onPress,
}) => <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;

// ...

<KeyboardToolbar button={CustomButton} />;
```

### `blur`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#blur "Direct link to blur")

This property allows to render custom blur effect for the toolbar (by default iOS keyboard is opaque and it blurs the content underneath, so if you want to follow **HIG** ([*Human Interface Guidelines*](https://developer.apple.com/design/human-interface-guidelines/materials)) properly - consider to add this effect).

By default it is `null` and will not render any blur effect, because it's not a responsibility of this library to provide a blur effect. Instead it provides a property where you can specify your own blur effect and its provider, i. e. `@react-native-community/blur`, `expo-blur` or maybe even `react-native-skia` (based on your project preferences of course).

warning

Please, note, that you need to specify `opacity` prop for this prop to work. Because otherwise you will not see a blur effect.

```
import { BlurView } from "@react-native-community/blur";
import {
  KeyboardToolbar,
  KeyboardToolbarProps,
} from "react-native-keyboard-controller";

const CustomBlur: KeyboardToolbarProps["blur"] = ({ children }) => (
  <BlurView
    blurType="chromeMaterial"
    blurAmount={10}
    reducedTransparencyFallbackColor="white"
    style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
  >
    {children}
  </BlurView>
);

// ...

<KeyboardToolbar blur={CustomBlur} opacity="4F" />;
```

### `content`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#content "Direct link to content")

This property allows you to show a custom content in the middle of the toolbar. It accepts JSX element. Default value is `null`.

```
<KeyboardToolbar
  content={
    showAutoFill ? (
      <AutoFillContacts onContactSelected={onContactSelected} />
    ) : null
  }
/>
```

### `doneText`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#donetext "Direct link to donetext")

The property that allows to specify custom text for `Done` button.

```
<KeyboardToolbar doneText="Close" />
```

### `icon`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#icon "Direct link to icon")

`icon` property allows to render custom icons for prev and next buttons.

```
import { Text } from "react-native";
import {
  KeyboardToolbar,
  KeyboardToolbarProps,
} from "react-native-keyboard-controller";

const Icon: KeyboardToolbarProps["icon"] = ({ type }) => {
  return <Text>{type === "next" ? "⬇️" : "⬆️"}</Text>;
};

// ...

<KeyboardToolbar icon={Icon} />;
```

### `insets`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#insets "Direct link to insets")

An object containing `left` and `right` properties that define the `KeyboardToolbar` padding. This helps prevent overlap with system UI elements, especially in landscape orientation:

```
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ...

const insets = useSafeAreaInsets();

<KeyboardToolbar insets={insets} />;
```

### `onDoneCallback`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#ondonecallback "Direct link to ondonecallback")

A callback that is called when the user presses the **done** button. The callback receives an instance of `GestureResponderEvent` which can be used to cancel the default action (for advanced use-cases).

```
import { Platform } from "react-native";
import { KeyboardToolbar } from "react-native-keyboard-controller";
import { trigger } from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
const haptic = () =>
  trigger(Platform.OS === "ios" ? "impactLight" : "keyboardTap", options);

// ...

<KeyboardToolbar onDoneCallback={haptic} />;
```

Prevent Default Action

To prevent the default action, call `e.preventDefault()` inside the callback:

```
<KeyboardToolbar
  onDoneCallback={(e) => {
    e.preventDefault(); // keyboard will not be dismissed, since we cancelled the default action
  }}
/>
```

### `onNextCallback`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#onnextcallback "Direct link to onnextcallback")

A callback that is called when the user presses the **next** button. The callback receives an instance of `GestureResponderEvent` which can be used to cancel the default action (for advanced use-cases).

```
import { Platform } from "react-native";
import { KeyboardToolbar } from "react-native-keyboard-controller";
import { trigger } from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
const haptic = () =>
  trigger(Platform.OS === "ios" ? "impactLight" : "keyboardTap", options);

// ...

<KeyboardToolbar onNextCallback={haptic} />;
```

Prevent Default Action

To prevent the default action, call `e.preventDefault()` inside the callback:

```
<KeyboardToolbar
  onNextCallback={(e) => {
    e.preventDefault(); // the focus will not be moved to the next input
  }}
/>
```

### `onPrevCallback`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#onprevcallback "Direct link to onprevcallback")

A callback that is called when the user presses the **previous** button. The callback receives an instance of `GestureResponderEvent` which can be used to cancel the default action (for advanced use-cases).

```
import { Platform } from "react-native";
import { KeyboardToolbar } from "react-native-keyboard-controller";
import { trigger } from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
const haptic = () =>
  trigger(Platform.OS === "ios" ? "impactLight" : "keyboardTap", options);

// ...

<KeyboardToolbar onPrevCallback={haptic} />;
```

Prevent Default Action

To prevent the default action, call `e.preventDefault()` inside the callback:

```
<KeyboardToolbar
  onPrevCallback={(e) => {
    e.preventDefault(); // the focus will not be moved to the prev input
  }}
/>
```

### `opacity`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#opacity "Direct link to opacity")

This property allows to specify the opacity of the toolbar container. The value must be specified in hexadecimal format. Default value is `FF`.

```
<KeyboardToolbar opacity="EE" />
```

### `showArrows`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#showarrows "Direct link to showarrows")

A boolean prop indicating whether to show `next` and `prev` buttons. Can be useful to set it to `false` if you have only one input and want to show only `Done` button. Default to `true`.

### `theme`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#theme "Direct link to theme")

Prop allowing you to specify the brand colors of your application for `KeyboardToolbar` component. If you want to re-use already platform specific colors you can import `DefaultKeyboardToolbarTheme` object and override colors only necessary colors:

```
import {
  DefaultKeyboardToolbarTheme,
  KeyboardToolbarProps,
} from "react-native-keyboard-controller";

const theme: KeyboardToolbarProps["theme"] = {
  ...DefaultKeyboardToolbarTheme,
  dark: {
    ...DefaultKeyboardToolbarTheme.dark,
    primary: "#FFCC00",
  },
};
```

dark/light theme support

Don't forget that you need to specify colors for **both** `dark` and `light` theme. The theme will be selected automatically based on the device preferences.

## Example[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#example "Direct link to Example")

```
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TextInput as TextInputRN, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

import type {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputProps,
} from "react-native";

export default function ToolbarExample() {
  return (
    <>
      <KeyboardAwareScrollView bottomOffset={35} style={scrollViewStyles}>
        <TextInput placeholder="Your name" title="Name" />
        <TextInput placeholder="Your surname" title="Surname" />
        <TextInput
          placeholder="example@gmail.com"
          title="Email"
          editable={false}
        />
        <TextInput
          placeholder="Tell us funny facts about you"
          title="About you"
          editable={false}
        />
        <View style={styles.row}>
          <View style={styles.birthday}>
            <TextInput placeholder="DD" title="Day" />
          </View>
          <View style={[styles.birthday, styles.withPadding]}>
            <TextInput placeholder="MM" title="Month" />
          </View>
          <View style={styles.birthday}>
            <TextInput placeholder="YYYY" title="Year" />
          </View>
        </View>
        <TextInput placeholder="Country" title="Country" />
        <TextInput placeholder="Region of the city" title="Region" />
        <TextInput placeholder="City where you currently live" title="City" />
        <TextInput placeholder="Street name" title="Street" />
        <TextInput placeholder="House number" title="House" />
        <TextInput placeholder="Flat number" title="Flat" />
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
  },
  birthday: {
    flex: 1 / 3,
  },
  withPadding: {
    paddingHorizontal: 16,
  },
});
const scrollViewStyles = [styles.withPadding, styles.container];

type CustomTextInputProps = {
  title?: string;
} & TextInputProps;

const TextInput = (props: CustomTextInputProps) => {
  const { title, ...rest } = props;
  const [isFocused, setFocused] = useState(false);

  const onFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true);
      props.onFocus?.(e);
    },
    [],
  );

  const onBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false);
      props.onBlur?.(e);
    },
    [],
  );

  return (
    <>
      {!!title && <Text style={textInputStyles.title}>{title}</Text>}
      <TextInputRN
        placeholderTextColor="#6c6c6c"
        style={[
          textInputStyles.container,
          rest.editable === false && textInputStyles.disabled,
          isFocused && textInputStyles.focused,
        ]}
        multiline
        numberOfLines={2}
        testID={rest.placeholder}
        {...rest}
        placeholder={`${rest.placeholder}`}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </>
  );
};

const textInputStyles = StyleSheet.create({
  title: {
    marginBottom: 6,
    marginLeft: 3,
    color: "black",
    fontSize: 16,
  },
  container: {
    width: "100%",
    minHeight: 50,
    maxHeight: 200,
    marginBottom: 50,
    borderColor: "black",
    borderWidth: 2,
    marginRight: 160,
    borderRadius: 10,
    color: "black",
    paddingHorizontal: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  focused: {
    borderColor: "#20AAFF",
  },
});
```

More comprehensive usage

For more comprehensive usage that covers more complex interactions please check [example](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example) app.

## Limitations[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#limitations "Direct link to Limitations")

* By default `TextInput` search happens within `UIViewController`/`FragmentActivity` (current screen if you are using `react-native-screens`)
* The order of the navigation is defined by the view hierarchy (commonly referred to as the view-tree).
