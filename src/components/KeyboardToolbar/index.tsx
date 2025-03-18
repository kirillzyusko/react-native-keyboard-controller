import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { FocusedInputEvents } from "../../bindings";
import { KeyboardController } from "../../module";
import useColorScheme from "../hooks/useColorScheme";
import KeyboardStickyView from "../KeyboardStickyView";

import Arrow from "./Arrow";
import Button from "./Button";
import { colors } from "./colors";

import type { HEX, KeyboardToolbarTheme } from "./types";
import type { KeyboardStickyViewProps } from "../KeyboardStickyView";
import type { ReactNode } from "react";
import type { GestureResponderEvent, ViewProps } from "react-native";

type SafeAreaInsets = {
  left: number;
  right: number;
};

export type KeyboardToolbarProps = Omit<
  ViewProps,
  "style" | "testID" | "children"
> & {
  /** An element that is shown in the middle of the toolbar. */
  content?: React.JSX.Element | null;
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
  onNextCallback?: (event: GestureResponderEvent) => void;
  /**
   * A callback that is called when the user presses the previous button along with the default action.
   */
  onPrevCallback?: (event: GestureResponderEvent) => void;
  /**
   * A callback that is called when the user presses the done button along with the default action.
   */
  onDoneCallback?: (event: GestureResponderEvent) => void;
  /**
   * A component that applies blur effect to the toolbar.
   */
  blur?: React.JSX.Element | null;
  /**
   * A value for container opacity in hexadecimal format (e.g. `ff`). Default value is `ff`.
   */
  opacity?: HEX;
  insets?: SafeAreaInsets;
} & Pick<KeyboardStickyViewProps, "offset" | "enabled">;

const TEST_ID_KEYBOARD_TOOLBAR = "keyboard.toolbar";
const TEST_ID_KEYBOARD_TOOLBAR_PREVIOUS = `${TEST_ID_KEYBOARD_TOOLBAR}.previous`;
const TEST_ID_KEYBOARD_TOOLBAR_NEXT = `${TEST_ID_KEYBOARD_TOOLBAR}.next`;
const TEST_ID_KEYBOARD_TOOLBAR_CONTENT = `${TEST_ID_KEYBOARD_TOOLBAR}.content`;
const TEST_ID_KEYBOARD_TOOLBAR_DONE = `${TEST_ID_KEYBOARD_TOOLBAR}.done`;

const KEYBOARD_TOOLBAR_HEIGHT = 42;
const DEFAULT_OPACITY: HEX = "FF";

/**
 * `KeyboardToolbar` is a component that is shown above the keyboard with `Prev`/`Next` and
 * `Done` buttons.
 */
const KeyboardToolbar: React.FC<KeyboardToolbarProps> = ({
  content,
  theme = colors,
  doneText = "Done",
  button,
  icon,
  showArrows = true,
  onNextCallback,
  onPrevCallback,
  onDoneCallback,
  blur = null,
  opacity = DEFAULT_OPACITY,
  offset: { closed = 0, opened = 0 } = {},
  enabled = true,
  insets,
  ...rest
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
      {
        paddingLeft: insets?.left,
        paddingRight: insets?.right,
      },
    ],
    [colorScheme, opacity, theme, insets],
  );
  const offset = useMemo(
    () => ({ closed: closed + KEYBOARD_TOOLBAR_HEIGHT, opened }),
    [closed, opened],
  );
  const ButtonContainer = button || Button;
  const IconContainer = icon || Arrow;

  const onPressNext = useCallback(
    (event: GestureResponderEvent) => {
      onNextCallback?.(event);

      if (!event.isDefaultPrevented()) {
        KeyboardController.setFocusTo("next");
      }
    },
    [onNextCallback],
  );
  const onPressPrev = useCallback(
    (event: GestureResponderEvent) => {
      onPrevCallback?.(event);

      if (!event.isDefaultPrevented()) {
        KeyboardController.setFocusTo("prev");
      }
    },
    [onPrevCallback],
  );
  const onPressDone = useCallback(
    (event: GestureResponderEvent) => {
      onDoneCallback?.(event);

      if (!event.isDefaultPrevented()) {
        KeyboardController.dismiss();
      }
    },
    [onDoneCallback],
  );

  return (
    <KeyboardStickyView enabled={enabled} offset={offset}>
      <View {...rest} style={toolbarStyle} testID={TEST_ID_KEYBOARD_TOOLBAR}>
        {blur}
        {showArrows && (
          <View style={styles.arrows}>
            <ButtonContainer
              accessibilityHint="Moves focus to the previous field"
              accessibilityLabel="Previous"
              disabled={isPrevDisabled}
              testID={TEST_ID_KEYBOARD_TOOLBAR_PREVIOUS}
              theme={theme}
              onPress={onPressPrev}
            >
              <IconContainer
                disabled={isPrevDisabled}
                theme={theme}
                type="prev"
              />
            </ButtonContainer>
            <ButtonContainer
              accessibilityHint="Moves focus to the next field"
              accessibilityLabel="Next"
              disabled={isNextDisabled}
              testID={TEST_ID_KEYBOARD_TOOLBAR_NEXT}
              theme={theme}
              onPress={onPressNext}
            >
              <IconContainer
                disabled={isNextDisabled}
                theme={theme}
                type="next"
              />
            </ButtonContainer>
          </View>
        )}

        <View style={styles.flex} testID={TEST_ID_KEYBOARD_TOOLBAR_CONTENT}>
          {content}
        </View>
        {doneText && (
          <ButtonContainer
            accessibilityHint="Closes the keyboard"
            accessibilityLabel="Done"
            rippleRadius={28}
            style={styles.doneButtonContainer}
            testID={TEST_ID_KEYBOARD_TOOLBAR_DONE}
            theme={theme}
            onPress={onPressDone}
          >
            <Text maxFontSizeMultiplier={1.3} style={doneStyle}>
              {doneText}
            </Text>
          </ButtonContainer>
        )}
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
  },
  arrows: {
    flexDirection: "row",
    paddingLeft: 8,
  },
  doneButton: {
    fontWeight: "600",
    fontSize: 15,
  },
  doneButtonContainer: {
    marginRight: 16,
    marginLeft: 8,
  },
});

export { colors as DefaultKeyboardToolbarTheme };
export default KeyboardToolbar;
