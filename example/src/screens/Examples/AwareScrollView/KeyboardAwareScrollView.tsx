import React, { FC, useCallback } from 'react';
import {
  GestureResponderEvent,
  ScrollViewProps,
  useWindowDimensions,
} from 'react-native';
import { useResizeMode } from 'react-native-keyboard-controller';
import Reanimated, {
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  useWorkletCallback,
} from 'react-native-reanimated';
import { useSmoothKeyboardHandler } from './useSmoothKeyboardHandler';

const BOTTOM_OFFSET = 50;

const KeyboardAwareScrollView: FC<ScrollViewProps> = ({
  children,
  ...rest
}) => {
  useResizeMode();

  const scrollViewAnimatedRef = useAnimatedRef<Reanimated.ScrollView>();
  const scrollPosition = useSharedValue(0);
  const click = useSharedValue(0);
  const position = useSharedValue(0);
  const fakeViewHeight = useSharedValue(0);
  const keyboardHeight = useSharedValue(0);

  const { height } = useWindowDimensions();

  const onScroll = useAnimatedScrollHandler(
    {
      onScroll: (e) => {
        position.value = e.contentOffset.y;
      },
    },
    []
  );

  const onContentTouch = useCallback((e: GestureResponderEvent) => {
    // to prevent clicks when keyboard is animating
    if (keyboardHeight.value === 0) {
      click.value = e.nativeEvent.pageY;
      scrollPosition.value = position.value;
    }
  }, []);

  /**
   * Function that will scroll a ScrollView as keyboard gets moving
   */
  const maybeScroll = useWorkletCallback((e: number) => {
    'worklet';

    fakeViewHeight.value = e;

    const visibleRect = height - keyboardHeight.value;

    if (visibleRect - click.value <= BOTTOM_OFFSET) {
      const interpolatedScrollTo = interpolate(
        e,
        [0, keyboardHeight.value],
        [0, keyboardHeight.value - (height - click.value) + BOTTOM_OFFSET]
      );
      const targetScrollY =
        Math.max(interpolatedScrollTo, 0) + scrollPosition.value;

      scrollTo(scrollViewAnimatedRef, 0, targetScrollY, false);
    }
  }, []);

  useSmoothKeyboardHandler(
    {
      onStart: (e) => {
        'worklet';

        if (e.height > 0) {
          // just persist height - later will be used in interpolation
          keyboardHeight.value = e.height;
        }
      },
      onMove: (e) => {
        'worklet';

        maybeScroll(e.height);
      },
      onEnd: (e) => {
        'worklet';

        keyboardHeight.value = e.height;
      },
    },
    [height]
  );

  const view = useAnimatedStyle(
    () => ({
      height: fakeViewHeight.value,
    }),
    []
  );

  return (
    <Reanimated.ScrollView
      ref={scrollViewAnimatedRef}
      {...rest}
      onScroll={onScroll}
      onTouchStart={onContentTouch}
      scrollEventThrottle={16}
    >
      {children}
      <Reanimated.View style={view} />
    </Reanimated.ScrollView>
  );
};

export default KeyboardAwareScrollView;
