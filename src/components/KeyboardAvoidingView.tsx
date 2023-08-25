import React, { forwardRef, useCallback } from 'react';
import {
  LayoutRectangle,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewProps,
} from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useWorkletCallback,
  runOnUI,
  useSharedValue,
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
  const height = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (e) => {
        'worklet';

        height.value = e.height;
      },
    },
    []
  );

  return { height };
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
      onLayout,
      ...props
    },
    ref
  ) => {
    const initialFrame = useSharedValue<LayoutRectangle | null>(null);
    const currentFrame = useSharedValue<LayoutRectangle | null>(null);

    const keyboard = useKeyboardAnimation();
    const { height: screenHeight } = useWindowDimensions();

    const onLayoutWorklet = useWorkletCallback((layout: LayoutRectangle) => {
      if (initialFrame.value == null) {
        initialFrame.value = layout;
      }

      currentFrame.value = layout;
    });

    const handleOnLayout = useCallback<NonNullable<ViewProps['onLayout']>>(
      (event) => {
        // TODO: runOnUI is needed? Can't update value directly
        runOnUI(onLayoutWorklet)(event.nativeEvent.layout);

        if (onLayout) {
          onLayout(event);
        }
      },
      [onLayout]
    );

    const getBackwardCompatibleHeight = useWorkletCallback(
      (keyboardHeight: number) => {
        if (currentFrame.value == null || initialFrame.value == null) {
          return 0;
        }

        const keyboardY =
          screenHeight - keyboardHeight - keyboardVerticalOffset;

        if (behavior === 'height') {
          return Math.max(
            keyboardHeight +
              currentFrame.value.y +
              currentFrame.value.height -
              keyboardY -
              initialFrame.value.height,
            0
          );
        }

        return Math.max(
          currentFrame.value.y + currentFrame.value.height - keyboardY,
          0
        );
      }
    );

    const animatedStyle = useAnimatedStyle(() => {
      const keyboardHeight = keyboard.height.value;

      const bottom = getBackwardCompatibleHeight(keyboardHeight);

      // we use `enabled === true` to be 100% compatible with original implementation
      const bottomHeight = enabled === true ? bottom : 0;

      switch (behavior) {
        case 'height':
          if (bottomHeight > 0) {
            return {
              height: bottomHeight,
              flex: 0,
            };
          }

          return {
            flex: 0,
          };

        case 'position':
          return {
            bottom: bottomHeight,
          };

        case 'padding':
          return { paddingBottom: bottomHeight };

        default:
          return {};
      }
    });

    if (behavior === 'position') {
      return (
        // @ts-expect-error types mismatches
        <Reanimated.View
          ref={ref}
          onLayout={handleOnLayout}
          style={style}
          {...props}
        >
          <Reanimated.View
            // @ts-expect-error include styles in useAnimatedStyle?
            style={StyleSheet.compose(contentContainerStyle, animatedStyle)}
          >
            {children}
          </Reanimated.View>
        </Reanimated.View>
      );
    }

    return (
      // @ts-expect-error types mismatches
      <Reanimated.View
        ref={ref}
        onLayout={handleOnLayout}
        style={!behavior ? style : StyleSheet.compose(style, animatedStyle)}
        {...props}
      >
        {children}
      </Reanimated.View>
    );
  }
);

export default KeyboardAvoidingView;
