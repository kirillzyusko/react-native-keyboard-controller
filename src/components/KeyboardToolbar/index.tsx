import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  FocusedInputEvents,
  KeyboardStickyView,
} from "react-native-keyboard-controller";

import { KeyboardController } from "../../bindings";
import useColorScheme from "../hooks/useColorScheme";

import Arrow from "./Arrow";
import Button from "./Button";
import { colors } from "./colors";

import type { KeyboardToolbarTheme } from "./colors";
import type { LayoutChangeEvent, ViewStyle } from "react-native";

export type KeyboardToolbarProps = {
  content: JSX.Element | null;
  theme?: KeyboardToolbarTheme;
};
const TEST_ID_KEYBOARD_TOOLBAR = "keyboard.toolbar";
const TEST_ID_KEYBOARD_TOOLBAR_PREVIOUS = `${TEST_ID_KEYBOARD_TOOLBAR}.previous`;
const TEST_ID_KEYBOARD_TOOLBAR_NEXT = `${TEST_ID_KEYBOARD_TOOLBAR}.next`;
const TEST_ID_KEYBOARD_TOOLBAR_CONTENT = `${TEST_ID_KEYBOARD_TOOLBAR}.content`;
const TEST_ID_KEYBOARD_TOOLBAR_DONE = `${TEST_ID_KEYBOARD_TOOLBAR}.done`;

const KEYBOARD_TOOLBAR_HEIGHT = 42;

// TODO: accessibility

const dismissKeyboard = () => KeyboardController.dismiss();
const goToNextField = () => KeyboardController.setFocusTo("next");
const goToPrevField = () => KeyboardController.setFocusTo("prev");

/**
 * `KeyboardToolbar` is a component that is shown above the keyboard with `Prev`/`Next` and
 * `Done` buttons.
 */
const KeyboardToolbar: React.FC<KeyboardToolbarProps> = ({
  content,
  theme = colors,
}) => {
  const colorScheme = useColorScheme();
  const [height, setHeight] = useState(0);
  const [inputs, setInputs] = useState({
    current: 0,
    count: 0,
  });
  const background: ViewStyle = useMemo(
    () => ({
      backgroundColor: theme[colorScheme].background,
    }),
    [colorScheme, theme],
  );
  const isPrevDisabled = inputs.current === 0;
  const isNextDisabled = inputs.current === inputs.count - 1;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height);
  }, []);

  useEffect(() => {
    const subscription = FocusedInputEvents.addListener("focusDidSet", (e) => {
      setInputs(e);
    });

    return subscription.remove;
  }, []);
  const doneStyle = useMemo(
    () => [styles.doneButton, { color: theme[colorScheme].primary }],
    [colorScheme, theme],
  );

  return (
    <KeyboardStickyView offset={{ closed: height }}>
      <View
        onLayout={onLayout}
        style={[
          styles.toolbar,
          height === 0 ? { marginBottom: -9999 } : null,
          background,
        ]}
        testID={TEST_ID_KEYBOARD_TOOLBAR}
      >
        <Button
          accessibilityLabel="Previous"
          accessibilityHint="Will move focus to previous field"
          disabled={isPrevDisabled}
          onPress={goToPrevField}
          testID={TEST_ID_KEYBOARD_TOOLBAR_PREVIOUS}
          theme={theme}
        >
          <Arrow disabled={isPrevDisabled} direction="up" theme={theme} />
        </Button>
        <Button
          accessibilityLabel="Next"
          accessibilityHint="Will move focus to next field"
          disabled={isNextDisabled}
          onPress={goToNextField}
          testID={TEST_ID_KEYBOARD_TOOLBAR_NEXT}
          theme={theme}
        >
          <Arrow disabled={isNextDisabled} direction="down" theme={theme} />
        </Button>

        <View style={styles.flex} testID={TEST_ID_KEYBOARD_TOOLBAR_CONTENT}>
          {content}
        </View>
        <Button
          accessibilityLabel="Done"
          accessibilityHint="Will close the keyboard"
          onPress={dismissKeyboard}
          testID={TEST_ID_KEYBOARD_TOOLBAR_DONE}
          rippleRadius={28}
          style={styles.doneButtonContainer}
          theme={theme}
        >
          <Text style={doneStyle} maxFontSizeMultiplier={1.3}>
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
    height: KEYBOARD_TOOLBAR_HEIGHT,
    paddingHorizontal: 8,
  },
  doneButton: {
    fontWeight: "600",
    fontSize: 15,
  },
  doneButtonContainer: {
    marginRight: 8,
  },
});

export { colors as DefaultKeyboardToolbarTheme };
export default KeyboardToolbar;
