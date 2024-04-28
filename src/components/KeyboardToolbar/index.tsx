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

import type { HEX, KeyboardToolbarTheme } from "./types";
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
  /**
   * Whether to show next and previous buttons. Can be useful to set it to `false` if you have only one input
   * and want to show only `Done` button. Default to `true`.
   */
  showArrows?: boolean;
  /**
   * A callback that is called when the user presses the next button along with the default action.
   */
  onNextCallback?: () => void;
  /**
   * A callback that is called when the user presses the previous button along with the default action.
   */
  onPrevCallback?: () => void;
  /**
   * A callback that is called when the user presses the done button along with the default action.
   */
  onDoneCallback?: () => void;
  /**
   * A component that applies blur effect to the toolbar.
   */
  blur?: JSX.Element | null;
  /**
   * A value for container opacity in hexadecimal format (e.g. `ff`). Default value is `ff`.
   */
  opacity?: HEX;
};
const TEST_ID_KEYBOARD_TOOLBAR = "keyboard.toolbar";
const TEST_ID_KEYBOARD_TOOLBAR_PREVIOUS = `${TEST_ID_KEYBOARD_TOOLBAR}.previous`;
const TEST_ID_KEYBOARD_TOOLBAR_NEXT = `${TEST_ID_KEYBOARD_TOOLBAR}.next`;
const TEST_ID_KEYBOARD_TOOLBAR_CONTENT = `${TEST_ID_KEYBOARD_TOOLBAR}.content`;
const TEST_ID_KEYBOARD_TOOLBAR_DONE = `${TEST_ID_KEYBOARD_TOOLBAR}.done`;

const KEYBOARD_TOOLBAR_HEIGHT = 42;
const DEFAULT_OPACITY: HEX = "FF";
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
  showArrows = true,
  onNextCallback,
  onPrevCallback,
  onDoneCallback,
  blur = null,
  opacity = DEFAULT_OPACITY,
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
        backgroundColor: `${theme[colorScheme].background}${opacity}`,
      },
    ],
    [colorScheme, opacity, theme],
  );
  const ButtonContainer = button || Button;
  const IconContainer = icon || Arrow;

  const onPressNext = useCallback(() => {
    goToNextField();
    onNextCallback?.();
  }, [onNextCallback]);
  const onPressPrev = useCallback(() => {
    goToPrevField();
    onPrevCallback?.();
  }, [onPrevCallback]);
  const onPressDone = useCallback(() => {
    dismissKeyboard();
    onDoneCallback?.();
  }, [onDoneCallback]);

  return (
    <KeyboardStickyView offset={offset}>
      <View style={toolbarStyle} testID={TEST_ID_KEYBOARD_TOOLBAR}>
        {blur}
        {showArrows && (
          <>
            <ButtonContainer
              accessibilityLabel="Previous"
              accessibilityHint="Will move focus to previous field"
              disabled={isPrevDisabled}
              onPress={onPressPrev}
              testID={TEST_ID_KEYBOARD_TOOLBAR_PREVIOUS}
              theme={theme}
            >
              <IconContainer
                disabled={isPrevDisabled}
                type="prev"
                theme={theme}
              />
            </ButtonContainer>
            <ButtonContainer
              accessibilityLabel="Next"
              accessibilityHint="Will move focus to next field"
              disabled={isNextDisabled}
              onPress={onPressNext}
              testID={TEST_ID_KEYBOARD_TOOLBAR_NEXT}
              theme={theme}
            >
              <IconContainer
                disabled={isNextDisabled}
                type="next"
                theme={theme}
              />
            </ButtonContainer>
          </>
        )}

        <View style={styles.flex} testID={TEST_ID_KEYBOARD_TOOLBAR_CONTENT}>
          {content}
        </View>
        <ButtonContainer
          accessibilityLabel="Done"
          accessibilityHint="Will close the keyboard"
          onPress={onPressDone}
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
