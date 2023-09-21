import React, { memo, useMemo, type ReactNode } from 'react';
import { View, ViewProps, type ViewStyle } from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface StickyFooterProps extends Pick<ViewProps, 'onLayout'> {
  children: ReactNode;
  /**
   * The offset to add when the keyboard is closed. Useful to position the
   * sticky bar above things such as a tab bar.
   */
  bottomOffsetWhenKeyboardIsClosed?: number;
}

export const StickyFooter = memo(
  ({
    children,
    bottomOffsetWhenKeyboardIsClosed,
    ...props
  }: StickyFooterProps) => {
    const { height, progress } = useReanimatedKeyboardAnimation();
    const { bottom } = useSafeAreaInsets();

    const actionBarAnimatedStyles = useAnimatedStyle(() => {
      /**
       * Height is a negative value, so we need to add it to the bottom inset. If
       * we didn't, when the keyboard is shown, the box would be ${bottomPadding} pixels
       * above the keyboard.
       */
      const translateY = interpolate(progress.value, [0, 1], [0, height.value]);

      /**
       * When the keyboard opens, we don't want additional padding since things
       * like tab bar and safe area are not visible.
       */
      const paddingBottom = interpolate(
        progress.value,
        [0, 1],
        [bottomOffsetWhenKeyboardIsClosed ?? 0, 0]
      );

      return {
        paddingBottom,
        transform: [{ translateY }],
      };
    }, [bottom, height, progress]);

    const actionBarStyles = useMemo<ViewStyle[]>(
      () => [
        {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'black', // just here to help debug
        },
        actionBarAnimatedStyles,
      ],
      [actionBarAnimatedStyles]
    );

    return (
      <Animated.View style={actionBarStyles} {...props}>
        {children}
      </Animated.View>
    );
  }
);
