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
* **Compound component pattern** 🔌: Mix and match sub-components for granular control over the toolbar's structure.

## Compound Components[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#compound-components "Direct link to Compound Components")

The new API uses sub-components as children of `KeyboardToolbar`. These allow for precise customization, such as conditional rendering of buttons or injecting custom elements.

### `<KeyboardToolbar.Background>`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#keyboardtoolbarbackground "Direct link to keyboardtoolbarbackground")

Renders a custom background (e.g., blur effect) that overlays the entire toolbar. Accepts any React node as children.

```
import { Platform } from "react-native";
import { KeyboardToolbar } from "react-native-keyboard-controller";
import { BlurView } from "@react-native-community/blur";

<KeyboardToolbar opacity="4F">
  <KeyboardToolbar.Background>
    <BlurView
      blurAmount={32}
      blurType={Platform.OS === "ios" ? "chromeMaterial" : "light"}
      reducedTransparencyFallbackColor="white"
      style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
    />
  </KeyboardToolbar.Background>
  {/* Other sub-components */}
</KeyboardToolbar>;
```

warning

Please, note, that you need to specify `opacity` prop for this prop to work. Because otherwise you will not see a blur effect.

### `<KeyboardToolbar.Content>`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#keyboardtoolbarcontent "Direct link to keyboardtoolbarcontent")

Renders a custom content (e.g., yours UI elements) in the middle of the toolbar. Accepts any React node as children.

```
import { KeyboardToolbar } from "react-native-keyboard-controller";

<KeyboardToolbar>
  <KeyboardToolbar.Content>
    {showAutoFill ? (
      <AutoFillContacts onContactSelected={onContactSelected} />
    ) : null}
  </KeyboardToolbar.Content>
  {/* Other sub-components */}
</KeyboardToolbar>;
```

### `<KeyboardToolbar.Prev>`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#keyboardtoolbarprev "Direct link to keyboardtoolbarprev")

#### `button`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#button "Direct link to button")

This property allows to render custom touchable component.

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

<KeyboardToolbar>
  <KeyboardToolbar.Prev button={CustomButton} />
</KeyboardToolbar>;
```

#### `icon`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#icon "Direct link to icon")

`icon` property allows to render custom icons.

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

<KeyboardToolbar>
  <KeyboardToolbar.Prev icon={Icon} />
</KeyboardToolbar>;
```

#### `onPress`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#onpress "Direct link to onpress")

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

<KeyboardToolbar>
  <KeyboardToolbar.Prev onPress={haptic} />
</KeyboardToolbar>;
```

Prevent Default Action

To prevent the default action, call `e.preventDefault()` inside the callback:

```
<KeyboardToolbar>
  <KeyboardToolbar.Prev
    onPress={(e) => {
      // the focus will not be moved to the prev input
      e.preventDefault();
    }}
  />
</KeyboardToolbar>
```

### `<KeyboardToolbar.Next>`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#keyboardtoolbarnext "Direct link to keyboardtoolbarnext")

#### `button`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#button-1 "Direct link to button-1")

This property allows to render custom touchable component.

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

<KeyboardToolbar>
  <KeyboardToolbar.Next button={CustomButton} />
</KeyboardToolbar>;
```

#### `icon`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#icon-1 "Direct link to icon-1")

`icon` property allows to render custom icons.

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

<KeyboardToolbar>
  <KeyboardToolbar.Next icon={Icon} />
</KeyboardToolbar>;
```

#### `onPress`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#onpress-1 "Direct link to onpress-1")

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

<KeyboardToolbar>
  <KeyboardToolbar.Next onPress={haptic} />
</KeyboardToolbar>;
```

Prevent Default Action

To prevent the default action, call `e.preventDefault()` inside the callback:

```
<KeyboardToolbar>
  <KeyboardToolbar.Next
    onPress={(e) => {
      // the focus will not be moved to the next input
      e.preventDefault();
    }}
  />
</KeyboardToolbar>
```

### `<KeyboardToolbar.Done>`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#keyboardtoolbardone "Direct link to keyboardtoolbardone")

#### `button`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#button-2 "Direct link to button-2")

This property allows to render custom touchable component.

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

<KeyboardToolbar>
  <KeyboardToolbar.Next button={CustomButton} />
</KeyboardToolbar>;
```

#### `onPress`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#onpress-2 "Direct link to onpress-2")

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

<KeyboardToolbar>
  <KeyboardToolbar.Done onPress={haptic} />
</KeyboardToolbar>;
```

Prevent Default Action

To prevent the default action, call `e.preventDefault()` inside the callback:

```
<KeyboardToolbar>
  <KeyboardToolbar.Done
    onPress={(e) => {
      // keyboard will not be dismissed, since we cancelled the default action
      e.preventDefault();
    }}
  />
</KeyboardToolbar>
```

#### `text`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#text "Direct link to text")

The property that allows to specify custom text for `Done` button.

```
<KeyboardToolbar>
  <KeyboardToolbar.Done text="Close" />
</KeyboardToolbar>
```

## Props[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#props "Direct link to Props")

### [`View Props`](https://reactnative.dev/docs/view#props)[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#view-props "Direct link to view-props")

Inherits [View Props](https://reactnative.dev/docs/view#props).

### [`KeyboardStickyViewProps`](/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view.md)[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#keyboardstickyviewprops "Direct link to keyboardstickyviewprops")

Inherits [KeyboardStickyViewProps](/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view.md).

### `insets`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#insets "Direct link to insets")

An object containing `left` and `right` properties that define the `KeyboardToolbar` padding. This helps prevent overlap with system UI elements, especially in landscape orientation:

```
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ...

const insets = useSafeAreaInsets();

<KeyboardToolbar insets={insets} />;
```

### `opacity`[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#opacity "Direct link to opacity")

This property allows to specify the opacity of the toolbar container. The value must be specified in hexadecimal format. Default value is `FF`.

```
<KeyboardToolbar opacity="EE" />
```

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
      <KeyboardToolbar>
        <KeyboardToolbar.Prev />
        <KeyboardToolbar.Next />
        <KeyboardToolbar.Done />
      </KeyboardToolbar>
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

## Migration to compound component[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#migration-to-compound-component "Direct link to Migration to compound component")

To migrate from the legacy prop-based API to the compound API:

1. Add elements that you want to render in the toolbar (e.g., `Prev`, `Next`, `Done`, `Content`, `Background`).

```
// Old:
<KeyboardToolbar />

// New:
<KeyboardToolbar>
  <KeyboardToolbar.Prev />
  <KeyboardToolbar.Next />
  <KeyboardToolbar.Done />
</KeyboardToolbar>
```

2. Move props like `content`, `blur`, `doneText` into dedicated sub-components:

```
// Old:
<KeyboardToolbar content={<AutoFillContacts />} blur={<BlurView />} doneText="Close" />

// New:
<KeyboardToolbar>
  <KeyboardToolbar.Background>
    <BlurView />
  </KeyboardToolbar.Background>
  <KeyboardToolbar.Content>
    <AutoFillContacts />
  </KeyboardToolbar.Content>
  <KeyboardToolbar.Done text="Close" />
</KeyboardToolbar>
```

3. If you used button callbacks, move them into dedicated sub-components:

```
// Old:
<KeyboardToolbar
  onNextCallback={haptic}
  onPrevCallback={haptic}
  onDoneCallback={haptic}
/>

// New:
<KeyboardToolbar>
  <KeyboardToolbar.Next onPress={haptic} />
  <KeyboardToolbar.Prev onPress={haptic} />
  <KeyboardToolbar.Done onPress={haptic} />
</KeyboardToolbar>
```

4. If you used `showArrows` prop, move it into conditional rendering:

```
// Old:
<KeyboardToolbar showArrows={false} />

// New:
<KeyboardToolbar>
  {showArrows ? <KeyboardToolbar.Prev /> : null}
  {showArrows ? <KeyboardToolbar.Next /> : null}
</KeyboardToolbar>
```

Struggle to migrate?

If you found any bugs or inconsistent behavior comparing to old implementation and can not migrate to new compound API - don't hesitate to open an [issue](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/new?assignees=kirillzyusko\&labels=bug\&template=bug_report.md\&title=). It will help the project 🙏

## Limitations[​](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md#limitations "Direct link to Limitations")

* By default `TextInput` search happens within `UIViewController`/`FragmentActivity` (current screen if you are using `react-native-screens`)
* The order of the navigation is defined by the view hierarchy (commonly referred to as the view-tree).
