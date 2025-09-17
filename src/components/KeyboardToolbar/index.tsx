import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { FocusedInputEvents } from "../../bindings";
import { useKeyboardState } from "../../hooks";
import KeyboardStickyView from "../KeyboardStickyView";

import Arrow from "./Arrow";
import Button from "./Button";
import { colors } from "./colors";
import { Blur, Content, Done, Next, Prev } from "./compound/components";
import { ToolbarContext } from "./compound/context";
import {
  DEFAULT_OPACITY,
  KEYBOARD_HAS_ROUNDED_CORNERS,
  KEYBOARD_TOOLBAR_HEIGHT,
  OPENED_OFFSET,
  TEST_ID_KEYBOARD_TOOLBAR,
} from "./constants";

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
  /**
   * An element that is shown in the middle of the toolbar.
   *
   * @deprecated Use compound API with `<KeyboardToolbar.Content />` component instead.
   */
  content?: React.JSX.Element | null;
  /** A set of dark/light colors consumed by toolbar component. */
  theme?: KeyboardToolbarTheme;
  /**
   * Custom text for done button.
   *
   * @deprecated Use compound API with `<KeyboardToolbar.Done />` component and `text` prop instead.
   */
  doneText?: ReactNode;
  /** Custom touchable component for toolbar (used for prev/next/done buttons). */
  button?: typeof Button;
  /** Custom icon component used to display next/prev buttons. */
  icon?: typeof Arrow;
  /**
   * Whether to show next and previous buttons. Can be useful to set it to `false` if you have only one input
   * and want to show only `Done` button. Default to `true`.
   *
   * @deprecated Use compound API and conditional rendering for `<KeyboardToolbar.Next />` and `<KeyboardToolbar.Prev />`.
   */
  showArrows?: boolean;
  /**
   * A callback that is called when the user presses the next button along with the default action.
   *
   * @deprecated Use compound API with `<KeyboardToolbar.Next />` and `onPress` callback instead.
   */
  onNextCallback?: (event: GestureResponderEvent) => void;
  /**
   * A callback that is called when the user presses the previous button along with the default action.
   *
   * @deprecated Use compound API with `<KeyboardToolbar.Prev />` and `onPress` callback instead.
   */
  onPrevCallback?: (event: GestureResponderEvent) => void;
  /**
   * A callback that is called when the user presses the done button along with the default action.
   *
   * @deprecated Use compound API with `<KeyboardToolbar.Done />` and `onPress` callback instead.
   */
  onDoneCallback?: (event: GestureResponderEvent) => void;
  /**
   * A component that applies blur effect to the toolbar.
   *
   * @deprecated Use compound API and `<KeyboardToolbar.Effect />` instead.
   */
  blur?: React.JSX.Element | null;
  /**
   * A value for container opacity in hexadecimal format (e.g. `ff`). Default value is `ff`.
   */
  opacity?: HEX;
  /**
   * A object containing `left`/`right` properties. Used to specify proper container padding in landscape mode.
   */
  insets?: SafeAreaInsets;
  /** JSX children in case if compound API is used. */
  children?: ReactNode;
} & Pick<KeyboardStickyViewProps, "offset" | "enabled">;

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
  Blur: typeof Blur;
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

      if (type === Blur) {
        // @ts-expect-error props are untyped
        blurChild = child.props.children;
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

KeyboardToolbar.Blur = Blur;
KeyboardToolbar.Content = Content;
KeyboardToolbar.Prev = Prev;
KeyboardToolbar.Next = Next;
KeyboardToolbar.Done = Done;

export { colors as DefaultKeyboardToolbarTheme };
export default KeyboardToolbar;
