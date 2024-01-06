import React, { forwardRef, useMemo } from "react";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";

import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";

import useKeyboardInterpolation from "../hooks/useKeyboardInterpolation";

import type { View, ViewProps } from "react-native";

type KeyboardStickyViewProps = {
  /**
   * Specify additional offset to the view for given keyboard state.
   */
  offset?: {
    /**
     * Adds additional `translateY` when keyboard is close. By default `0`.
     */
    closed?: number;
    /**
     * Adds additional `translateY` when keyboard is open. By default `0`.
     */
    opened?: number;
  };
} & ViewProps;

const KeyboardStickyView = forwardRef<
  View,
  React.PropsWithChildren<KeyboardStickyViewProps>
>(
  (
    { children, offset: { closed = 0, opened = 0 } = {}, style, ...props },
    ref,
  ) => {
    const { height } = useReanimatedKeyboardAnimation();
    const { interpolate } = useKeyboardInterpolation();

    const stickyViewStyle = useAnimatedStyle(() => {
      const offset = interpolate(-height.value, [closed, opened]);

      return {
        transform: [{ translateY: height.value + offset }],
      };
    }, [closed, opened]);

    const styles = useMemo(
      () => [style, stickyViewStyle],
      [style, stickyViewStyle],
    );

    return (
      <Reanimated.View ref={ref} style={styles} {...props}>
        {children}
      </Reanimated.View>
    );
  },
);

export default KeyboardStickyView;
