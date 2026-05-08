import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, View } from "react-native";

import { KeyboardControllerNative, KeyboardEvents } from "../../bindings";
import { useKeyboardContext } from "../../context";
import { useWindowDimensions } from "../../hooks";
import { useAnimatedValue } from "../../internal";
import { findNodeHandle } from "../../utils/findNodeHandle";
import useCombinedRef from "../hooks/useCombinedRef";

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
    const { animated } = useKeyboardContext();
    const frameRef = useRef<LayoutRectangle>(defaultLayout);
    const internalRef = useRef<View | null>(null);
    const { height: screenHeight } = useWindowDimensions();

    // Stores the relative keyboard height (pixels) for the current keyboard session.
    // Updated just before the keyboard animation starts (keyboardWillShow), so that
    // Animated.multiply(progress, relativeHeightValue) smoothly tracks the keyboard.
    const relativeHeightValue = useAnimatedValue(0);

    const computeRelativeHeight = useCallback(
      (keyboardHeight: number) => {
        const frame = frameRef.current;
        const keyboardY =
          screenHeight - keyboardHeight - keyboardVerticalOffset;
        return Math.max(frame.y + frame.height - keyboardY, 0);
      },
      [screenHeight, keyboardVerticalOffset],
    );

    useEffect(() => {
      const showSub = KeyboardEvents.addListener("keyboardWillShow", (e) => {
        relativeHeightValue.setValue(computeRelativeHeight(e.height));
      });
      const didHideSub = KeyboardEvents.addListener("keyboardDidHide", () => {
        relativeHeightValue.setValue(0);
      });

      return () => {
        showSub.remove();
        didHideSub.remove();
      };
    }, [computeRelativeHeight, relativeHeightValue]);

    const onLayout = useCallback<NonNullable<ViewProps["onLayout"]>>(
      (e) => {
        onLayoutProps?.(e);

        const layout = e.nativeEvent.layout;

        if (automaticOffset) {
          const tag = findNodeHandle(internalRef.current);

          if (tag !== null) {
            return KeyboardControllerNative.viewPositionInWindow(tag)
              .then((position) => {
                frameRef.current = {
                  ...layout,
                  x: position.x,
                  y: position.y,
                };
              })
              .catch(() => {
                frameRef.current = layout;
              });
          }
        }

        frameRef.current = layout;
      },
      [onLayoutProps, automaticOffset],
    );

    // bottom = progress * relativeKeyboardHeight.
    // Both operands are stable Animated nodes (same reference for the component's
    // lifetime), so we create this derived node once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const bottom = useMemo(
      () => Animated.multiply(animated.progress, relativeHeightValue),
      [],
    );

    const animatedStyle = useMemo(() => {
      if (!enabled) {
        return {};
      }

      switch (behavior) {
        case "height":
        case "padding":
          return { paddingBottom: bottom };

        case "position":
          return { bottom };

        case "translate-with-padding":
          // Simplified: translate-with-padding falls back to padding behavior
          // without the reanimated-specific translation component.
          return { paddingBottom: bottom };

        default:
          return {};
      }
    }, [behavior, enabled, bottom]);

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
          <Animated.View style={combinedStyles}>{children}</Animated.View>
        </View>
      );
    }

    return (
      <Animated.View
        ref={combinedRef}
        style={combinedStyles}
        onLayout={onLayout}
        {...props}
      >
        {children}
      </Animated.View>
    );
  },
);

export default KeyboardAvoidingView;