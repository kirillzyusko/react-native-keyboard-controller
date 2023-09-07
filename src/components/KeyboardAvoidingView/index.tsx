import React, { forwardRef, useCallback, useMemo } from 'react';
import {
  LayoutRectangle,
  useWindowDimensions,
  View,
  ViewProps,
} from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useWorkletCallback,
  useSharedValue,
  useDerivedValue,
  interpolate,
} from 'react-native-reanimated';
import { useKeyboardAnimation } from './hooks';

type Props = {
  /**
   * Specify how to react to the presence of the keyboard.
   */
  behavior?: 'height' | 'position' | 'padding';

  /**
   * Style of the content container when `behavior` is 'position'.
   */
  contentContainerStyle?: ViewProps['style'];

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
    ref
  ) => {
    const initialFrame = useSharedValue<LayoutRectangle | null>(null);
    const frame = useDerivedValue(() => initialFrame.value || defaultLayout);

    const keyboard = useKeyboardAnimation();
    const { height: screenHeight } = useWindowDimensions();

    const relativeKeyboardHeight = useWorkletCallback(() => {
      const keyboardY =
        screenHeight - keyboard.heightWhenOpened.value - keyboardVerticalOffset;

      return Math.max(frame.value.y + frame.value.height - keyboardY, 0);
    }, [screenHeight, keyboardVerticalOffset]);

    const onLayout = useCallback<NonNullable<ViewProps['onLayout']>>(
      (e) => {
        if (initialFrame.value === null) {
          initialFrame.value = e.nativeEvent.layout;
        }
        onLayoutProps?.(e);
      },
      [onLayoutProps]
    );

    const animatedStyle = useAnimatedStyle(() => {
      const bottom = interpolate(
        keyboard.progress.value,
        [0, 1],
        [0, relativeKeyboardHeight()]
      );
      const bottomHeight = enabled ? bottom : 0;

      switch (behavior) {
        case 'height':
          if (bottomHeight > 0) {
            return {
              height: frame.value.height - bottomHeight,
              flex: 0,
            };
          }

          return {};

        case 'position':
          return { bottom: bottomHeight };

        case 'padding':
          return { paddingBottom: bottomHeight };

        default:
          return {};
      }
    }, [behavior, enabled, relativeKeyboardHeight]);
    const isPositionBehavior = behavior === 'position';
    const containerStyle = isPositionBehavior ? contentContainerStyle : style;
    const combinedStyles = useMemo(
      () => [containerStyle, animatedStyle],
      [containerStyle, animatedStyle]
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
        // @ts-expect-error because `ref` from reanimated is not compatible with react-native
        ref={ref}
        onLayout={onLayout}
        style={combinedStyles}
        {...props}
      >
        {children}
      </Reanimated.View>
    );
  }
);

export default KeyboardAvoidingView;
