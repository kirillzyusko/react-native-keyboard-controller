import React, { forwardRef, useCallback, useMemo } from "react";
import { View } from "react-native";
import Reanimated, {
  interpolate,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { useGenericKeyboardHandler, useWindowDimensions } from "../../hooks";
import useCombinedRef from "../hooks/useCombinedRef";

import { useKeyboardAnimation, useTranslateAnimation } from "./hooks";

import type { LayoutRectangle, ViewProps } from "react-native";

export type KeyboardAvoidingViewBaseProps = {
  /**
   * Controls whether this `KeyboardAvoidingView` instance should take effect.
   * This is useful when more than one is on the screen. Defaults to true.
   */
  enabled?: boolean;

  /**
   * Distance between the top of the user screen and the React Native view. This
   * may be non-zero in some cases. Defaults to 0.
   */
  keyboardVerticalOffset?: number;

  /**
   * When `true`, the view automatically detects its position on screen,
   * accounting for navigation headers, modals, and other layout offsets.
   * This means `keyboardVerticalOffset` becomes purely additive extra
   * space rather than compensation for unknown positioning.
   *
   * Defaults to `false` for backward compatibility.
   */
  automaticOffset?: boolean;
} & ViewProps;

export type KeyboardAvoidingViewProps = KeyboardAvoidingViewBaseProps &
  (
    | {
        /**
         * Specify how to react to the presence of the keyboard.
         */
        behavior?: "position";

        /**
         * Style of the content container when `behavior` is 'position'.
         */
        contentContainerStyle?: ViewProps["style"];
      }
    | {
        /**
         * Specify how to react to the presence of the keyboard.
         */
        behavior?: "height" | "padding" | "translate-with-padding";

        /**
         * `contentContainerStyle` is not allowed for these behaviors.
         */
        contentContainerStyle?: never;
      }
  );

const defaultLayout: LayoutRectangle = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

/**
 * A View component that automatically adjusts its height, position, or bottom padding
 * when the keyboard appears to ensure that the content remains visible.
 *
 * @returns A View component that adjusts to keyboard visibility.
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view|Documentation} page for more details.
 * @example
 * ```tsx
 * <KeyboardAvoidingView behavior="padding">
 *   <TextInput />
 * </KeyboardAvoidingView>
 * ```
 */
const KeyboardAvoidingView = forwardRef<
  View,
  React.PropsWithChildren<KeyboardAvoidingViewProps>
>(
  (
    {
      behavior,
      children,
      contentContainerStyle,
      enabled = true,
      keyboardVerticalOffset = 0,
      automaticOffset = false,
      style,
      onLayout: onLayoutProps,
      ...props
    },
    ref,
  ) => {
    const initialFrame = useSharedValue<LayoutRectangle | null>(null);
    const internalRef = React.useRef<View | null>(null);
    const frame = useDerivedValue(() => initialFrame.value || defaultLayout);

    const { translate, padding } = useTranslateAnimation();
    const keyboard = useKeyboardAnimation();
    const { height: screenHeight } = useWindowDimensions();

    const relativeKeyboardHeight = useCallback(() => {
      "worklet";

      const keyboardY =
        screenHeight - keyboard.heightWhenOpened.value - keyboardVerticalOffset;

      return Math.max(frame.value.y + frame.value.height - keyboardY, 0);
    }, [screenHeight, keyboardVerticalOffset]);
    const interpolateToRelativeKeyboardHeight = useCallback(
      (value: number) => {
        "worklet";

        return interpolate(value, [0, 1], [0, relativeKeyboardHeight()]);
      },
      [relativeKeyboardHeight],
    );

    const onLayoutWorklet = useCallback(
      (layout: LayoutRectangle) => {
        "worklet";

        if (
          keyboard.isClosed.value ||
          initialFrame.value === null ||
          behavior !== "height"
        ) {
          // When the keyboard is open in height mode, storing the shrunk
          // frame would cause a feedback loop (resize → recalculate →
          // resize), so that case falls through to the else-if below.
          // eslint-disable-next-line react-compiler/react-compiler
          initialFrame.value = layout;
        } else if (automaticOffset) {
          // automaticOffset uses measureInWindow, which may return stale
          // y=0 during modal animation. The corrected y arrives on a
          // later onLayout that falls through here. Accept the corrected
          // position but preserve the original height to avoid the same
          // feedback loop.
          initialFrame.value = { ...layout, height: initialFrame.value.height };
        }
      },
      [behavior, automaticOffset],
    );
    const onLayout = useCallback<NonNullable<ViewProps["onLayout"]>>(
      (e) => {
        const layout = e.nativeEvent.layout;

        if (automaticOffset) {
          // ref is always set here — onLayout only fires after mount
          internalRef.current?.measureInWindow((x, y) => {
            runOnUI(onLayoutWorklet)({ ...layout, x, y });
          });
        } else {
          runOnUI(onLayoutWorklet)(layout);
        }

        onLayoutProps?.(e);
      },
      [onLayoutProps, automaticOffset],
    );

    // In a modal, measureInWindow can return stale y=0 while the modal
    // is still animating into place. Other modes self-correct because
    // resizing the view triggers a new onLayout with fresh measurements.
    // Position mode can't — its outer view never resizes (only the inner
    // view shifts via { bottom }), so onLayout never re-fires. We use
    // useGenericKeyboardHandler to re-measure on keyboard start, when
    // the modal has settled. The async JS hop is safe because the outer
    // view stays put during keyboard animation.
    const remeasurePositionMode = useCallback(() => {
      internalRef.current?.measureInWindow((x, y, width, height) => {
        runOnUI(onLayoutWorklet)({ x, y, width, height });
      });
    }, [onLayoutWorklet]);

    useGenericKeyboardHandler(
      {
        onStart: () => {
          "worklet";

          if (automaticOffset && behavior === "position") {
            runOnJS(remeasurePositionMode)();
          }
        },
      },
      [automaticOffset, behavior, remeasurePositionMode],
    );

    const animatedStyle = useAnimatedStyle(() => {
      if (!enabled) {
        return {};
      }

      const bottom = interpolateToRelativeKeyboardHeight(
        keyboard.progress.value,
      );
      const translateY = interpolateToRelativeKeyboardHeight(translate.value);
      const paddingBottom = interpolateToRelativeKeyboardHeight(padding.value);
      const height = frame.value.height - bottom;

      switch (behavior) {
        case "height":
          if (!keyboard.isClosed.value && height > 0) {
            return {
              height,
              flex: 0,
            };
          }

          return {};

        case "position":
          return { bottom };

        case "padding":
          return { paddingBottom: bottom };

        case "translate-with-padding":
          return {
            paddingTop: paddingBottom,
            transform: [{ translateY: -translateY }],
          };

        default:
          return {};
      }
    }, [behavior, enabled, interpolateToRelativeKeyboardHeight]);
    const combinedRef = useCombinedRef(internalRef, ref);
    const isPositionBehavior = behavior === "position";
    const containerStyle = isPositionBehavior ? contentContainerStyle : style;
    const combinedStyles = useMemo(
      () => [containerStyle, animatedStyle],
      [containerStyle, animatedStyle],
    );

    if (isPositionBehavior) {
      return (
        <View ref={combinedRef} style={style} onLayout={onLayout} {...props}>
          <Reanimated.View style={combinedStyles}>{children}</Reanimated.View>
        </View>
      );
    }

    return (
      <Reanimated.View
        ref={combinedRef}
        style={combinedStyles}
        onLayout={onLayout}
        {...props}
      >
        {children}
      </Reanimated.View>
    );
  },
);

export default KeyboardAvoidingView;
