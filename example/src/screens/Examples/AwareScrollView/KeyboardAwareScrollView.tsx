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

/**
 * Everything begins from `onStart` handler. This handler is called every time,
 * when keyboard changes its size or when focused `TextInput` was changed. In
 * this handler we are calculating/memoizing values which later will be used
 * during layout movement. For that we calculate:
 * - layout of focused field (`layout`) - to understand whether there will be overlap
 * - initial keyboard size (`initialKeyboardSize`) - used in scroll interpolation
 * - future keyboard height (`keyboardHeight`) - used in scroll interpolation
 * - current scroll position (`scrollPosition`) - used to scroll from this point
 *
 * Once we've calculated all necessary variables - we can actually start to use them.
 * It happens in `onMove` handler - this function simply calls `maybeScroll` with
 * current keyboard frame height. This functions makes the smooth transition.
 *
 * When the transition has finished we go to `onEnd` handler. In this handler
 * we verify, that the current field is not overlapped within a keyboard frame.
 * For full `onStart`/`onMove`/`onEnd` flow it may look like a redundant thing,
 * however there could be some cases, when `onMove` is not called:
 * - on iOS when TextInput was changed - keyboard transition is instant
 * - on Android when TextInput was changed and keyboard size wasn't changed
 * So `onEnd` handler handle the case, when `onMove` wasn't triggered.
 *
 * ====================================================================================================================+
 * -----------------------------------------------------Flow chart-----------------------------------------------------+
 * ====================================================================================================================+
 *
 * +============================+       +============================+        +==================================+
 * +  User Press on TextInput   +   =>  +  Keyboard starts showing   +   =>   + As keyboard moves frame by frame +  =>
 * +                            +       +       (run `onStart`)      +        +    `onMove` is getting called    +
 * +============================+       +============================+        +==================================+
 *
 *
 * +============================+       +============================+        +=====================================+
 * + Keyboard is shown and we   +   =>  +    User moved focus to     +   =>   + Only `onStart`/`onEnd` maybe called +
 * +    call `onEnd` handler    +       +     another `TextInput`    +        +    (without involving `onMove`)     +
 * +============================+       +============================+        +=====================================+
 *
 */
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
  const initialKeyboardSize = useSharedValue(0);
  const scrollBeforeKeyboardMovement = useSharedValue(0);

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
        [initialKeyboardSize.value, keyboardHeight.value],
        [0, keyboardHeight.value - (height - point) + BOTTOM_OFFSET]
      );
      const targetScrollY =
        Math.max(interpolatedScrollTo, 0) + scrollPosition.value;
      scrollTo(scrollViewAnimatedRef, 0, targetScrollY, animated);
    }
  }, []);

  useSmoothKeyboardHandler(
    {
      onStart: (e) => {
        'worklet';

        const keyboardWillChangeSize =
          keyboardHeight.value !== e.height && e.height > 0;
        const keyboardWillAppear = e.height > 0 && keyboardHeight.value === 0;
        const keyboardWillHide = e.height === 0;
        if (keyboardWillChangeSize) {
          initialKeyboardSize.value = keyboardHeight.value;
        }

        if (keyboardWillHide) {
          // on back transition need to interpolate as [0, keyboardHeight]
          initialKeyboardSize.value = 0;
          scrollPosition.value = scrollBeforeKeyboardMovement.value;
        }

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
            // save current scroll position - when keyboard will hide we'll reuse
            // this value to achieve smooth hide effect
            scrollBeforeKeyboardMovement.value = position.value;
          }
        }
      },
      onMove: (e) => {
        'worklet';

        maybeScroll(e.height);
      },
      onEnd: (e) => {
        'worklet';

        keyboardHeight.value = e.height;
        scrollPosition.value = position.value;

        if (e.target !== -1 && e.height !== 0) {
          const prevLayout = layout.value;
          // just be sure, that view is no overlapped (i.e. focus changed)
          layout.value = measureByTag(e.target);
          maybeScroll(e.height, true);
          // do layout substitution back to assure there will be correct
          // back transition when keyboard hides
          layout.value = prevLayout;
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
