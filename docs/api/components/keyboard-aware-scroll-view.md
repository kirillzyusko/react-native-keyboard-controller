# KeyboardAwareScrollView

<!-- -->

`ScrollView` that effortlessly handles keyboard appearance, automatically scrolls to focused `TextInput` and provides a native-like performance.

## Comparison[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#comparison "Direct link to Comparison")

Current `react-native` ecosystem has a plenty of solutions that solves the problem of focused inputs being covered by keyboard. Each of them has its own advantages and disadvantages.

Below is a table with the most important functions and their support in various implementations:

|                                                               | [react-native-avoid-soft-input](https://mateusz1913.github.io/react-native-avoid-softinput/) | [react-native-keyboard-aware-scroll-view](https://github.com/APSL/react-native-keyboard-aware-scroll-view) | [react-native-keyboard-manager](https://github.com/douglasjunior/react-native-keyboard-manager) | [react-native-keyboard-controller](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md) |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Respects keyboard animation                                   | 🟠 1                                                                                         | ❌                                                                                                         | ✅                                                                                              | ✅                                                                                                                      |
| JS implementation                                             | ❌                                                                                           | ✅                                                                                                         | ❌                                                                                              | 🟠 2                                                                                                                    |
| Reacts on focused input layout changes                        | ❌                                                                                           | ❌                                                                                                         | 🟠 3                                                                                            | ✅                                                                                                                      |
| Reacts on focus changes                                       | ✅                                                                                           | ✅                                                                                                         | ✅                                                                                              | ✅                                                                                                                      |
| Reacts on selection changes                                   | ❌                                                                                           | ❌                                                                                                         | 🟠 3                                                                                            | ✅                                                                                                                      |
| Auto-scroll when user is typing and input in non visible area | ❌                                                                                           | ❌                                                                                                         | 🟠 3                                                                                            | ✅                                                                                                                      |
| Android support                                               | ✅                                                                                           | ✅                                                                                                         | ❌                                                                                              | ✅                                                                                                                      |
| Maintained                                                    | ✅                                                                                           | ❌                                                                                                         | ✅                                                                                              | ✅                                                                                                                      |
| Support Fabric (new) architecture                             | ✅                                                                                           | 🟠 4                                                                                                       | ❌                                                                                              | ✅                                                                                                                      |

> 1 **only** on **iOS**

> 2 `KeyboardAwareScrollView` is implemented in JS, but some hooks (`useKeyboardHandler`/`useReanimatedFocusedInput`/`useFocusedInputHandler`) exposed from native code

> 3 achievable with `KeyboardManager.reloadLayoutIfNeeded()` usage in appropriate `TextInput` callbacks (`onLayout`/`onChangeText`/`onSelectionChange`)

> 4 since it's JS based solution it supports new architecture, but it uses **deprecated** API.

## Props[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#props "Direct link to Props")

### [`ScrollView Props`](https://reactnative.dev/docs/scrollview#props)[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#scrollview-props "Direct link to scrollview-props")

Inherits [ScrollView Props](https://reactnative.dev/docs/scrollview#props).

### `ScrollViewComponent`[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#scrollviewcomponent "Direct link to scrollviewcomponent")

Custom component that will be used as a `ScrollView`. Default is `ScrollView`.

When to use it?

If you want to use `ScrollView` from `react-native-gesture-handler` you can pass it as a `ScrollViewComponent` prop.

```
import { ScrollView } from "react-native-gesture-handler";

<KeyboardAwareScrollView ScrollViewComponent={ScrollView} />;
```

### `bottomOffset`[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#bottomoffset "Direct link to bottomoffset")

The distance between the keyboard and the caret inside a focused `TextInput` when the keyboard is shown. Default is `0`.

`react-native-keyboard-aware-scroll-view` equivalent

This property is equivalent to [extraHeight](https://github.com/APSL/react-native-keyboard-aware-scroll-view/tree/9eee405f7b3e261faf86a0fc8e495288d91c853e?tab=readme-ov-file#props) from original [react-native-keyboard-aware-scroll-view](https://github.com/APSL/react-native-keyboard-aware-scroll-view) package.

warning

If you specified `snapToOffsets` to your `ScrollView` then `KeyboardAwareScrollView` will automatically respect to these values and an actual `bottomOffset` may be bigger (but focused input will be always above the keyboard anyway).

### `disableScrollOnKeyboardHide`[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#disablescrollonkeyboardhide "Direct link to disablescrollonkeyboardhide")

Prevents automatic scrolling of the `ScrollView` when the keyboard gets hidden, maintaining the current screen position. Default is `false`.

### `enabled`[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#enabled "Direct link to enabled")

A boolean prop indicating whether `KeyboardAwareScrollView` is enabled or disabled. Default is `true`.

### `extraKeyboardSpace`[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#extrakeyboardspace "Direct link to extrakeyboardspace")

Adjusting the bottom spacing of `KeyboardAwareScrollView`. Default is `0`.

When to use it?

It can be useful when there is some space between the `KeyboardAwareScrollView` and the ***bottom edge*** of the screen (and you don't want the full keyboard frame to be in the bottom). In such cases, you can specify a **negative** value.

If you have ***sticky elements*** above the keyboard and want to extend the keyboard frame in the bottom of `ScrollView`, then you can specify a **positive** value.

`react-native-keyboard-aware-scroll-view` equivalent

This property acts as [extraScrollHeight](https://github.com/APSL/react-native-keyboard-aware-scroll-view/tree/9eee405f7b3e261faf86a0fc8e495288d91c853e?tab=readme-ov-file#props) from original [react-native-keyboard-aware-scroll-view](https://github.com/APSL/react-native-keyboard-aware-scroll-view) package.

## Integration with 3rd party components[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#integration-with-3rd-party-components "Direct link to Integration with 3rd party components")

### `FlatList`/`FlashList`/`SectionList` etc.[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#flatlistflashlistsectionlist-etc "Direct link to flatlistflashlistsectionlist-etc")

Unlike original [react-native-keyboard-aware-scroll-view](https://github.com/APSL/react-native-keyboard-aware-scroll-view) package I'm not exporting `KeyboardAwareFlatList`, `KeyboardAwareSectionList` and other components.

If you want to integrate it with your custom virtualization list, you can pass `renderScrollComponent` prop like:

```
import React from "react";
import { FlatList, ScrollView, ScrollViewProps } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

<FlatList
  renderScrollComponent={(props) => <KeyboardAwareScrollView {...props} />}
/>;

// or

import { FlashList } from "@shopify/flash-list";

const RenderScrollComponent = React.forwardRef<ScrollView, ScrollViewProps>(
  (props, ref) => <KeyboardAwareScrollView {...props} ref={ref} />,
);

<FlashList renderScrollComponent={RenderScrollComponent} />;
```

Click to see a full code example with integration

```
import React from "react";
import { View, FlatList, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const List = () => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={new Array(10).fill(0).map((_, i) => i)}
        keyExtractor={(data) => String(data)}
        renderItem={() => {
          return (
            <View
              style={{
                width: "100%",
                height: 250,
                backgroundColor: "#00000066",
                justifyContent: "center",
              }}
            >
              <TextInput
                style={{
                  height: 40,
                  width: "100%",
                  borderColor: "black",
                  borderWidth: 2,
                }}
              />
            </View>
          );
        }}
        renderScrollComponent={(props) => (
          <KeyboardAwareScrollView {...props} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default List;
```

### `@gorhom/bottom-sheet`[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#gorhombottom-sheet "Direct link to gorhombottom-sheet")

To seamlessly work with [@gorhom/bottom-sheet](https://github.com/gorhom/react-native-bottom-sheet) you will need to wrap `KeyboardAwareScrollView` in some HOCs provided by `@gorhom/bottom-sheet`.

BottomSheetKeyboardAwareScrollView\.tsx

```
import { memo } from "react";
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller";
import {
  SCROLLABLE_TYPE,
  createBottomSheetScrollableComponent,
  type BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet";
import type { BottomSheetScrollViewProps } from "@gorhom/bottom-sheet/src/components/bottomSheetScrollable/types";
import Reanimated from "react-native-reanimated";

const AnimatedScrollView =
  Reanimated.createAnimatedComponent<KeyboardAwareScrollViewProps>(
    KeyboardAwareScrollView,
  );
const BottomSheetScrollViewComponent = createBottomSheetScrollableComponent<
  BottomSheetScrollViewMethods,
  BottomSheetScrollViewProps
>(SCROLLABLE_TYPE.SCROLLVIEW, AnimatedScrollView);
const BottomSheetKeyboardAwareScrollView = memo(BottomSheetScrollViewComponent);

BottomSheetKeyboardAwareScrollView.displayName =
  "BottomSheetKeyboardAwareScrollView";

export default BottomSheetKeyboardAwareScrollView as (
  props: BottomSheetScrollViewProps & KeyboardAwareScrollViewProps,
) => ReturnType<typeof BottomSheetKeyboardAwareScrollView>;
```

index.tsx

```
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetKeyboardAwareScrollView from "./BottomSheetKeyboardAwareScrollView";

export function Example() {
  return (
    <BottomSheet>
      <BottomSheetKeyboardAwareScrollView>
        {/* More content here */}
      </BottomSheetKeyboardAwareScrollView>
    </BottomSheet>
  );
}
```

## Methods[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#methods "Direct link to Methods")

### `assureFocusedInputVisible`[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#assurefocusedinputvisible "Direct link to assurefocusedinputvisible")

A method that assures that focused input is visible and not obscured by keyboard or other elements.

You may want to call it, when layout inside `ScrollView` changes (for example validation message appears or disappears and it shifts position of focused input).

## Example[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#example "Direct link to Example")

```
import React from "react";
import {
  StyleSheet,
  TextInputProps,
  TextInput as TextInputRN,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const TextInput = (props: TextInputProps) => {
  return (
    <TextInputRN
      placeholderTextColor="#6c6c6c"
      style={styles.textInput}
      multiline
      numberOfLines={2}
      testID={props.placeholder}
      {...props}
      placeholder={`${props.placeholder} (${
        props.keyboardType === "default" ? "text" : "numeric"
      })`}
    />
  );
};

export default function AwareScrollView() {
  return (
    <KeyboardAwareScrollView
      bottomOffset={50}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {new Array(10).fill(0).map((_, i) => (
        <TextInput
          key={i}
          placeholder={`TextInput#${i}`}
          keyboardType={i % 2 === 0 ? "numeric" : "default"}
        />
      ))}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  content: {
    paddingTop: 50,
  },
  textInput: {
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
});
```

## Known issues[​](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md#known-issues "Direct link to Known issues")

* [react-native-reanimated#5567](https://github.com/software-mansion/react-native-reanimated/issues/5567): Resizing content inside `ScrollView` prevents multiline `TextInput` from growing in Fabric
