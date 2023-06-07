import React, { Component, FC } from 'react';
import { ScrollViewProps, useWindowDimensions } from 'react-native';
import { useResizeMode } from 'react-native-keyboard-controller';
import Reanimated, {
  MeasuredDimensions,
  interpolate,
  measure,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  useWorkletCallback,
} from 'react-native-reanimated';
import { useSmoothKeyboardHandler } from './useSmoothKeyboardHandler';
import { useInterruptibleScrollTo } from './useInterruptibleScrollTo';
import { RefObjectFunction } from 'react-native-reanimated/lib/types/lib/reanimated2/hook/commonTypes';

const BOTTOM_OFFSET = 50;

const KeyboardAwareScrollView: FC<ScrollViewProps> = ({
  children,
  ...rest
}) => {
  useResizeMode();

  const scrollViewAnimatedRef = useAnimatedRef<Reanimated.ScrollView>();
  const { scroll, pause } = useInterruptibleScrollTo(scrollViewAnimatedRef);
  const scrollPosition = useSharedValue(0);
  const layout = useSharedValue<MeasuredDimensions | null>(null);
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

  const measureByTag = useWorkletCallback((tag: number) => {
    return measure(
      (() => tag) as unknown as RefObjectFunction<Component<{}, {}, any>>
    );
  }, []);

  /**
   * Function that will scroll a ScrollView as keyboard gets moving
   */
  const maybeScroll = useWorkletCallback((e: number) => {
    fakeViewHeight.value = e;

    const visibleRect = height - keyboardHeight.value;
    const point = (layout.value?.pageY || 0) + (layout.value?.height || 0);

    if (visibleRect - point <= BOTTOM_OFFSET) {
      const interpolatedScrollTo = interpolate(
        e,
        [0, keyboardHeight.value],
        [0, keyboardHeight.value - (height - point) + BOTTOM_OFFSET]
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
        console.log(
          'onStart',
          new Date().getTime(),
          e.target,
          keyboardHeight.value
        );
        // keyboard was closed and will appear
        if (e.height > 0 && keyboardHeight.value === 0) {
          // just persist height - later will be used in interpolation
          keyboardHeight.value = e.height;
          // save position of focused text input when keyboard starts to move
          layout.value = measureByTag(e.target);
          console.log('UPDATED LAYOUT::', layout.value);
        }
      },
      onMove: (e) => {
        'worklet';
        console.log('onMove', new Date().getTime(), e.target);

        maybeScroll(e.height);
      },
      onEnd: (e) => {
        'worklet';
        console.log('onEnd', new Date().getTime(), e.target);
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
      scrollEventThrottle={16}
    >
      {children}
      <Reanimated.View style={view} />
    </Reanimated.ScrollView>
  );
};

export default KeyboardAwareScrollView;
