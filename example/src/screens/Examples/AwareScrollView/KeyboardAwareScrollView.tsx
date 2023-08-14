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
import { RefObjectFunction } from 'react-native-reanimated/lib/types/lib/reanimated2/hook/commonTypes';
import { useSmoothKeyboardHandler } from './useSmoothKeyboardHandler';

const BOTTOM_OFFSET = 50;

const KeyboardAwareScrollView: FC<ScrollViewProps> = ({
  children,
  ...rest
}) => {
  const scrollViewAnimatedRef = useAnimatedRef<Reanimated.ScrollView>();
  const scrollPosition = useSharedValue(0);
  const position = useSharedValue(0);
  const layout = useSharedValue<MeasuredDimensions | null>(null);
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

    if (visibleRect - point <= BOTTOM_OFFSET) {
      const interpolatedScrollTo = interpolate(
        e,
        [interpolateFrom.value, keyboardHeight.value],
        [0, keyboardHeight.value - (height - point) + BOTTOM_OFFSET]
      );
      const targetScrollY =
        Math.max(interpolatedScrollTo, 0) + scrollPosition.value;

      console.log({ targetScrollY, interpolatedScrollTo });
      scrollTo(scrollViewAnimatedRef, 0, targetScrollY, animated);
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

        const keyboardWillChangeSize =
          keyboardHeight.value !== e.height && e.height > 0;
        const keyboardWillAppear = e.height > 0 && keyboardHeight.value === 0;
        if (keyboardWillChangeSize) {
          interpolateFrom.value = keyboardHeight.value;
        }

        // keyboard will appear
        if (keyboardWillAppear || keyboardWillChangeSize) {
          // persist scroll value
          scrollPosition.value = position.value;
          // just persist height - later will be used in interpolation
          keyboardHeight.value = e.height;
        }

        // focus was changed
        if (tag.value !== e.target || keyboardWillChangeSize) {
          tag.value = e.target;

          if (tag.value !== -1) {
            // save position of focused text input when keyboard starts to move
            layout.value = measureByTag(e.target);
            console.log('UPDATED LAYOUT::', layout.value);
          }
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
