import React, { forwardRef, useCallback } from 'react';
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
import { useKeyboardHandler } from '../hooks';

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

const useKeyboardAnimation = () => {
  const heightWhenOpened = useSharedValue(0);
  const height = useSharedValue(0);
  const progress = useSharedValue(0);

  useKeyboardHandler(
    {
      onStart: (e) => {
        'worklet';

        if (e.height > 0) {
          heightWhenOpened.value = e.height;
        }
      },
      onMove: (e) => {
        'worklet';

        progress.value = e.progress;
        height.value = e.height;
      },
    },
    []
  );

  return { height, progress, heightWhenOpened };
};

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
      const bottomHeight = enabled === true ? bottom : 0;

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
          return {
            bottom: bottomHeight,
          };

        case 'padding':
          return { paddingBottom: bottomHeight };

        default:
          return {};
      }
    }, [behavior, enabled, relativeKeyboardHeight]);

    if (behavior === 'position') {
      return (
        <View ref={ref} style={style} onLayout={onLayout} {...props}>
          <Reanimated.View style={[contentContainerStyle, animatedStyle]}>
            {children}
          </Reanimated.View>
        </View>
      );
    }

    return (
      <Reanimated.View
        // @ts-expect-error because `ref` from reanimated is not compatible with react-native
        ref={ref}
        onLayout={onLayout}
        style={enabled ? [style, animatedStyle] : [style]}
        {...props}
      >
        {children}
      </Reanimated.View>
    );
  }
);

export default KeyboardAvoidingView;
