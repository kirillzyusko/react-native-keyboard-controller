import React, { forwardRef, useCallback, useMemo } from "react";
import { View, useWindowDimensions } from "react-native";
import Reanimated, {
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import useKeyboardInterpolation from "../hooks/useKeyboardInterpolation";

import { useKeyboardAnimation } from "./hooks";

import type { LayoutRectangle, ViewProps } from "react-native";

type Props = {
  /**
   * Specify how to react to the presence of the keyboard.
   */
  behavior?: "height" | "position" | "padding";

  /**
   * Style of the content container when `behavior` is 'position'.
   */
  contentContainerStyle?: ViewProps["style"];

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
} & ViewProps;

const defaultLayout: LayoutRectangle = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

/**
 * View that moves out of the way when the keyboard appears by automatically
 * adjusting its height, position, or bottom padding.
 */
const KeyboardAvoidingView = forwardRef<View, React.PropsWithChildren<Props>>(
  (
    {
      behavior,
      children,
      contentContainerStyle,
      enabled = true,
      keyboardVerticalOffset = 0,
      style,
      onLayout: onLayoutProps,
      ...props
    },
    ref,
  ) => {
    const initialFrame = useSharedValue<LayoutRectangle | null>(null);
    const frame = useDerivedValue(() => initialFrame.value || defaultLayout);

    const keyboard = useKeyboardAnimation();
    const { height: screenHeight } = useWindowDimensions();

    const relativeKeyboardHeight = useCallback(() => {
      "worklet";

      const keyboardY =
        screenHeight - keyboard.heightWhenOpened.value - keyboardVerticalOffset;

      return Math.max(frame.value.y + frame.value.height - keyboardY, 0);
    }, [screenHeight, keyboardVerticalOffset]);
    const { interpolate } = useKeyboardInterpolation();

    const onLayoutWorklet = useCallback((layout: LayoutRectangle) => {
      "worklet";

      if (keyboard.isClosed.value) {
        initialFrame.value = layout;
      }
    }, []);
    const onLayout = useCallback<NonNullable<ViewProps["onLayout"]>>(
      (e) => {
        runOnUI(onLayoutWorklet)(e.nativeEvent.layout);
        onLayoutProps?.(e);
      },
      [onLayoutProps],
    );

    const animatedStyle = useAnimatedStyle(() => {
      const bottom = interpolate(keyboard.height.value, [
        0,
        relativeKeyboardHeight(),
      ]);
      const bottomHeight = enabled ? bottom : 0;

      switch (behavior) {
        case "height":
          if (!keyboard.isClosed.value) {
            return {
              height: frame.value.height - bottomHeight,
              flex: 0,
            };
          }

          return {};

        case "position":
          return { bottom: bottomHeight };

        case "padding":
          return { paddingBottom: bottomHeight };

        default:
          return {};
      }
    }, [behavior, enabled, relativeKeyboardHeight]);
    const isPositionBehavior = behavior === "position";
    const containerStyle = isPositionBehavior ? contentContainerStyle : style;
    const combinedStyles = useMemo(
      () => [containerStyle, animatedStyle],
      [containerStyle, animatedStyle],
    );

    if (isPositionBehavior) {
      return (
        <View ref={ref} style={style} onLayout={onLayout} {...props}>
          <Reanimated.View style={combinedStyles}>{children}</Reanimated.View>
        </View>
      );
    }

    return (
      <Reanimated.View
        ref={ref}
        onLayout={onLayout}
        style={combinedStyles}
        {...props}
      >
        {children}
      </Reanimated.View>
    );
  },
);

export default KeyboardAvoidingView;
