import React, { forwardRef, useCallback, useMemo } from "react";
import { findNodeHandle, View } from "react-native";
import Reanimated, {
  interpolate,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { KeyboardControllerNative } from "../../bindings";
import { useWindowDimensions } from "../../hooks";
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

export type KeyboardAvoidingViewProps = KeyboardAvoidingViewBaseProps & {
  /**
   * Specify how to react to the presence of the keyboard.
   */
  behavior?: "height" | "padding" | "position" | "translate-with-padding";

  /**
   * Style of the content container when `behavior` is 'position'.
   */
  contentContainerStyle?: ViewProps["style"];
};

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
          // When automaticOffset is enabled, always preserve the pre-keyboard
          // frame to avoid iOS modal keyboard adjustment shrinking the frame.
          // Without automaticOffset, only preserve for "height" behavior
          // (existing behavior for backward compatibility).
          (!automaticOffset && behavior !== "height")
        ) {
          // eslint-disable-next-line react-compiler/react-compiler
          initialFrame.value = layout;
        }
      },
      [behavior, automaticOffset],
    );
    const onLayout = useCallback<NonNullable<ViewProps["onLayout"]>>(
      (e) => {
        const layout = e.nativeEvent.layout;

        if (automaticOffset) {
          const node = internalRef.current;
          const tag = node ? findNodeHandle(node) : null;

          if (tag != null) {
            // Use native windowPosition to get true screen-absolute coordinates.
            // This bypasses Fabric's measureInWindow which returns
            // surface-relative coordinates inside Modals (RN bug #52450).
            KeyboardControllerNative.windowPosition(tag)
              .then((position) => {
                runOnUI(onLayoutWorklet)({
                  ...layout,
                  x: position.x,
                  y: position.y,
                });
              })
              .catch(() => {
                // windowPosition failed (e.g. view unmounted or tag not found).
                // Fall back to measureInWindow which returns correct absolute
                // coordinates on Paper architecture.
                if (node) {
                  node.measureInWindow((x, y) => {
                    runOnUI(onLayoutWorklet)({ ...layout, x, y });
                  });
                } else {
                  runOnUI(onLayoutWorklet)(layout);
                }
              });
          }
        } else {
          runOnUI(onLayoutWorklet)(layout);
        }

        onLayoutProps?.(e);
      },
      [onLayoutProps, automaticOffset],
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
