import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { FocusedInputEvents } from "../../bindings";
import { useKeyboardState } from "../../hooks";
import KeyboardStickyView from "../KeyboardStickyView";

import Arrow from "./Arrow";
import Button from "./Button";
import { colors } from "./colors";
import { Background, Content, Done, Next, Prev } from "./compound/components";
import { ToolbarContext } from "./compound/context";
import {
  DEFAULT_OPACITY,
  KEYBOARD_HAS_ROUNDED_CORNERS,
  KEYBOARD_TOOLBAR_HEIGHT,
  OPENED_OFFSET,
  TEST_ID_KEYBOARD_TOOLBAR,
} from "./constants";

import type { KeyboardToolbarProps } from "./types";
import type { ReactNode } from "react";

/**
 * `KeyboardToolbar` is a component that is shown above the keyboard with `Prev`/`Next` buttons from left and
 * `Done` button from the right (to dismiss the keyboard). Allows to add customizable content (yours UI elements) in the middle.
 *
 * @param props - Component props.
 * @returns A component that is shown above the keyboard with `Prev`/`Next` and `Done` buttons.
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-toolbar|Documentation} page for more details.
 * @example
 * ```tsx
 * <KeyboardToolbar>
 *   <KeyboardToolbar.Done text="Close" />
 * </KeyboardToolbar>
 * ```
 */
const KeyboardToolbar: React.FC<KeyboardToolbarProps> & {
  Background: typeof Background;
  Content: typeof Content;
  Prev: typeof Prev;
  Next: typeof Next;
  Done: typeof Done;
} = (props) => {
  const {
    children,
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
  } = props;
  const colorScheme = useKeyboardState((state) => state.appearance);
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
  const toolbarStyle = useMemo(
    () => [
      styles.toolbar,
      {
        backgroundColor: `${theme[colorScheme].background}${opacity}`,
      },
      !KEYBOARD_HAS_ROUNDED_CORNERS
        ? {
            paddingLeft: insets?.left,
            paddingRight: insets?.right,
          }
        : null,
      KEYBOARD_HAS_ROUNDED_CORNERS ? styles.floating : null,
    ],
    [colorScheme, opacity, theme, insets],
  );
  const containerStyle = useMemo(
    () => [
      KEYBOARD_HAS_ROUNDED_CORNERS
        ? {
            marginLeft: (insets?.left ?? 0) + 16,
            marginRight: (insets?.right ?? 0) + 16,
          }
        : null,
    ],
    [insets],
  );
  const offset = useMemo(
    () => ({
      closed: closed + KEYBOARD_TOOLBAR_HEIGHT,
      opened: opened + OPENED_OFFSET,
    }),
    [closed, opened],
  );

  let blurElement: ReactNode = null;
  let arrowsElement: ReactNode = null;
  let contentContainer: ReactNode = null;
  let doneElement: ReactNode = null;

  if (children) {
    let prevChild: ReactNode = null;
    let nextChild: ReactNode = null;
    let contentChild: ReactNode = null;
    let doneChild: ReactNode = null;
    let blurChild: ReactNode = null;

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        return;
      }
      const type = child.type;

      if (type === Background) {
        blurChild = child;
      } else if (type === Content) {
        contentChild = child;
      } else if (type === Prev) {
        prevChild = child;
      } else if (type === Next) {
        nextChild = child;
      } else if (type === Done) {
        doneChild = child;
      }
    });

    blurElement = blurChild;
    doneElement = doneChild;
    arrowsElement =
      prevChild || nextChild ? (
        <View style={styles.arrows}>
          {prevChild}
          {nextChild}
        </View>
      ) : null;
    contentContainer = contentChild ?? <Content>{contentChild}</Content>;
  } else {
    blurElement = blur;
    arrowsElement = showArrows ? (
      <View style={styles.arrows}>
        <Prev onPress={onPrevCallback} />
        <Next onPress={onNextCallback} />
      </View>
    ) : null;
    contentContainer = <Content>{content}</Content>;
    doneElement = doneText ? (
      <Done text={doneText} onPress={onDoneCallback} />
    ) : null;
  }

  const contextValue = useMemo(
    () => ({
      theme,
      colorScheme,
      buttonContainer: button ?? Button,
      iconContainer: icon ?? Arrow,
      isPrevDisabled,
      isNextDisabled,
    }),
    [theme, colorScheme, button, icon, isPrevDisabled, isNextDisabled],
  );

  return (
    <ToolbarContext.Provider value={contextValue}>
      <KeyboardStickyView
        enabled={enabled}
        offset={offset}
        style={containerStyle}
      >
        <View {...rest} style={toolbarStyle} testID={TEST_ID_KEYBOARD_TOOLBAR}>
          {blurElement}
          {arrowsElement}
          {contentContainer}
          {doneElement}
        </View>
      </KeyboardStickyView>
    </ToolbarContext.Provider>
  );
};

const styles = StyleSheet.create({
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
  floating: {
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
  },
});

KeyboardToolbar.Background = Background;
KeyboardToolbar.Content = Content;
KeyboardToolbar.Prev = Prev;
KeyboardToolbar.Next = Next;
KeyboardToolbar.Done = Done;

export { colors as DefaultKeyboardToolbarTheme };
export default KeyboardToolbar;
