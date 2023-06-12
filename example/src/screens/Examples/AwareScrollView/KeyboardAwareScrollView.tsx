import React, { Component, FC } from 'react';
import { ScrollViewProps, useWindowDimensions } from 'react-native';
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

// iOS: поставил фокус, убрал - нет анимашки как была раньше (когда текст инпутник летит вниз, а потом вверх) :(
// iOS: поставить фокус на 9-й элемент, потом на 8 - резкий джамп
const KeyboardAwareScrollView: FC<ScrollViewProps> = ({
  children,
  ...rest
}) => {
  const scrollViewAnimatedRef = useAnimatedRef<Reanimated.ScrollView>();
  const scrollPosition = useSharedValue(0);
  const { scroll, pause, isScrolling } = useInterruptibleScrollTo(
    scrollViewAnimatedRef,
    scrollPosition
  );
  const layout = useSharedValue<MeasuredDimensions | null>(null);
  const position = useSharedValue(0);
  const fakeViewHeight = useSharedValue(0);
  const keyboardHeight = useSharedValue(0);
  const tag = useSharedValue(-1);
  const interpolateFrom = useSharedValue(0);

  const { height } = useWindowDimensions();

  const onScroll = useAnimatedScrollHandler(
    {
      onScroll: (e) => {
        position.value = e.contentOffset.y;
      },
    },
    []
  );

  const measureByTag = useWorkletCallback((viewTag: number) => {
    return measure(
      (() => viewTag) as unknown as RefObjectFunction<Component<{}, {}, any>>
    );
  }, []);

  /**
   * Function that will scroll a ScrollView as keyboard gets moving
   */
  const maybeScroll = useWorkletCallback((e: number, animated = false) => {
    fakeViewHeight.value = e;

    const visibleRect = height - keyboardHeight.value;
    const point = (layout.value?.pageY || 0) + (layout.value?.height || 0);
    console.log(layout.value);
    console.log(
      123333,
      visibleRect - point,
      BOTTOM_OFFSET,
      keyboardHeight.value - (height - point) + BOTTOM_OFFSET,
      interpolateFrom.value
    );
    if (visibleRect - point < BOTTOM_OFFSET) {
      const interpolatedScrollTo = interpolate(
        e,
        [interpolateFrom.value, keyboardHeight.value],
        [0, keyboardHeight.value - (height - point) + BOTTOM_OFFSET]
      );
      const targetScrollY =
        Math.max(interpolatedScrollTo, 0) + scrollPosition.value;
      console.log({ interpolatedScrollTo, targetScrollY });
      if (animated) {
        // TODO: create common function to calculate `targetScrollY`?
        scroll(0, targetScrollY);
      } else {
        scrollTo(scrollViewAnimatedRef, 0, targetScrollY, false);
      }
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
          e.height,
          keyboardHeight.value
        );
        if (keyboardHeight.value !== e.height && e.height > 0) {
          interpolateFrom.value = keyboardHeight.value;
        }
        pause();
        scrollPosition.value = position.value;
        if (
          tag.value !== e.target ||
          (keyboardHeight.value !== e.height && e.height > 0)
        ) {
          tag.value = e.target;
          // save position of focused text input when keyboard starts to move
          layout.value = measureByTag(e.target);
          console.log('UPDATED LAYOUT::', layout.value);
        }

        // keyboard will appear or change its size
        if (e.height > 0) {
          // just persist height - later will be used in interpolation
          keyboardHeight.value = e.height;
        }
      },
      onMove: (e) => {
        'worklet';
        console.log('onMove', new Date().getTime(), e.target, e.height);

        maybeScroll(e.height);
      },
      onEnd: (e) => {
        'worklet';
        console.log('onEnd', new Date().getTime(), e.target, e.height);
        keyboardHeight.value = e.height;
        scrollPosition.value = position.value;

        if (e.target !== -1 && e.height !== 0) {
          // just be sure, that view is no overlapped (i.e. focus changed)
          layout.value = measureByTag(e.target);
          maybeScroll(e.height, true);
        }
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
