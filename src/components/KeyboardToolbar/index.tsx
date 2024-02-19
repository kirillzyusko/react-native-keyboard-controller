import React, { useEffect, useMemo, useState } from "react";
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
import type { ReactNode } from "react";

export type KeyboardToolbarProps = {
  /** An element that is shown in the middle of the toolbar. */
  content?: JSX.Element | null;
  /** A set of dark/light colors consumed by toolbar component. */
  theme?: KeyboardToolbarTheme;
  /** Custom text for done button. */
  doneText?: ReactNode;
  /** Custom touchable component for toolbar (used for prev/next/done buttons). */
  button?: typeof Button;
  /** Custom icon component used to display next/prev buttons. */
  icon?: typeof Arrow;
};
const TEST_ID_KEYBOARD_TOOLBAR = "keyboard.toolbar";
const TEST_ID_KEYBOARD_TOOLBAR_PREVIOUS = `${TEST_ID_KEYBOARD_TOOLBAR}.previous`;
const TEST_ID_KEYBOARD_TOOLBAR_NEXT = `${TEST_ID_KEYBOARD_TOOLBAR}.next`;
const TEST_ID_KEYBOARD_TOOLBAR_CONTENT = `${TEST_ID_KEYBOARD_TOOLBAR}.content`;
const TEST_ID_KEYBOARD_TOOLBAR_DONE = `${TEST_ID_KEYBOARD_TOOLBAR}.done`;

const KEYBOARD_TOOLBAR_HEIGHT = 42;
const offset = { closed: KEYBOARD_TOOLBAR_HEIGHT };

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
  doneText,
  button,
  icon,
}) => {
  const colorScheme = useColorScheme();
  const [inputs, setInputs] = useState({
    current: 0,
    count: 0,
  });
  const isPrevDisabled = inputs.current === 0;
  const isNextDisabled = inputs.current === inputs.count - 1;

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
  const toolbarStyle = useMemo(
    () => [
      styles.toolbar,
      {
        backgroundColor: theme[colorScheme].background,
      },
    ],
    [colorScheme, theme],
  );
  const ButtonContainer = button || Button;
  const IconContainer = icon || Arrow;

  return (
    <KeyboardStickyView offset={offset}>
      <View style={toolbarStyle} testID={TEST_ID_KEYBOARD_TOOLBAR}>
        <ButtonContainer
          accessibilityLabel="Previous"
          accessibilityHint="Will move focus to previous field"
          disabled={isPrevDisabled}
          onPress={goToPrevField}
          testID={TEST_ID_KEYBOARD_TOOLBAR_PREVIOUS}
          theme={theme}
        >
          <IconContainer disabled={isPrevDisabled} type="prev" theme={theme} />
        </ButtonContainer>
        <ButtonContainer
          accessibilityLabel="Next"
          accessibilityHint="Will move focus to next field"
          disabled={isNextDisabled}
          onPress={goToNextField}
          testID={TEST_ID_KEYBOARD_TOOLBAR_NEXT}
          theme={theme}
        >
          <IconContainer disabled={isNextDisabled} type="next" theme={theme} />
        </ButtonContainer>

        <View style={styles.flex} testID={TEST_ID_KEYBOARD_TOOLBAR_CONTENT}>
          {content}
        </View>
        <ButtonContainer
          accessibilityLabel="Done"
          accessibilityHint="Will close the keyboard"
          onPress={dismissKeyboard}
          testID={TEST_ID_KEYBOARD_TOOLBAR_DONE}
          rippleRadius={28}
          style={styles.doneButtonContainer}
          theme={theme}
        >
          <Text style={doneStyle} maxFontSizeMultiplier={1.3}>
            {doneText || "Done"}
          </Text>
        </ButtonContainer>
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
