import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";

import {
  FocusedInputEvents,
  KeyboardStickyView,
} from "react-native-keyboard-controller";

import { KeyboardController } from "../../bindings";

import Arrow from "./Arrow";
import Button from "./Button";
import { colors } from "./colors";

import type { LayoutChangeEvent, TextStyle, ViewStyle } from "react-native";

export type KeyboardToolbarProps = {
  Content: JSX.Element | null;
};

// TODO: accessibility

const dismissKeyboard = () => KeyboardController.dismiss();
const goToNextField = () => KeyboardController.setFocusTo("next");
const goToPrevField = () => KeyboardController.setFocusTo("prev");
/**
 * `KeyboardToolbar` is a component that is shown above the keyboard with `Prev`/`Next` and
 * `Done` buttons.
 */
const KeyboardToolbar: React.FC<KeyboardToolbarProps> = ({ Content }) => {
  const theme = useColorScheme() || "light";
  const [height, setHeight] = useState(0);
  const [inputs, setInputs] = useState({
    current: 0,
    count: 0,
  });
  const background: ViewStyle = { backgroundColor: colors[theme].background };
  const done: TextStyle = { color: colors[theme].primary };
  const isPrevDisabled = inputs.current === 0;
  const isNextDisabled = inputs.current === inputs.count - 1;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height);
  }, []);

  useEffect(() => {
    const subscription = FocusedInputEvents.addListener("focusDidSet", (e) => {
      setInputs(e);
    });

    return () => subscription.remove();
  }, []);

  return (
    <KeyboardStickyView offset={{ closed: height }}>
      <View
        // TODO: check whether it's readable or not
        accessibilityLabel="Toolbar"
        onLayout={onLayout}
        style={[
          styles.toolbar,
          height === 0 ? { marginBottom: -9999 } : null,
          background,
        ]}
        testID="keyboard.toolbar"
      >
        <Button
          accessibilityLabel="Previous"
          accessibilityHint="Will move focus to previous field"
          disabled={isPrevDisabled}
          onPress={goToPrevField}
          testID="keyboard.toolbar.previous"
        >
          <Arrow disabled={isPrevDisabled} direction="up" />
        </Button>
        <Button
          accessibilityLabel="Next"
          accessibilityHint="Will move focus to next field"
          disabled={isNextDisabled}
          onPress={goToNextField}
          testID="keyboard.toolbar.next"
        >
          <Arrow disabled={isNextDisabled} direction="down" />
        </Button>

        <View style={styles.flex} testID="keyboard.toolbar.content">
          {Content}
        </View>
        <Button
          accessibilityLabel="Done"
          accessibilityHint="Will close the keyboard"
          onPress={dismissKeyboard}
          testID="keyboard.toolbar.done"
        >
          <Text
            style={[
              {
                marginRight: 8,
                fontWeight: "600",
                fontSize: 15,
              },
              done,
            ]}
            maxFontSizeMultiplier={1.3}
          >
            Done
          </Text>
        </Button>
      </View>
    </KeyboardStickyView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  toolbar: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    // TODO: don't hardcode? How to get this value from in `bottomOffset` in `KeyboardAwareScrollView`?
    height: 42,
    paddingHorizontal: 8,
  },
});

export default KeyboardToolbar;
