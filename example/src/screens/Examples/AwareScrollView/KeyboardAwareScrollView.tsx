import React, { FC, useCallback } from 'react';
import {
  GestureResponderEvent,
  Platform,
  ScrollViewProps,
  useWindowDimensions,
} from 'react-native';
import {
  useKeyboardHandler,
  useResizeMode,
} from 'react-native-keyboard-controller';
import Reanimated, {
  Easing,
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  useWorkletCallback,
  withTiming,
} from 'react-native-reanimated';

const IS_ANDROID_ELEVEN_OR_HIGHER =
  Platform.OS === 'android' && Platform.Version >= 30;
// on these platforms keyboard transitions will be smooth
const IS_ANDROID_ELEVEN_OR_HIGHER_OR_IOS =
  IS_ANDROID_ELEVEN_OR_HIGHER || Platform.OS === 'ios';
// on Android Telegram is not using androidx.core values and uses custom interpolation
// duration is taken from here: https://github.com/DrKLO/Telegram/blob/e9a35cea54c06277c69d41b8e25d94b5d7ede065/TMessagesProj/src/main/java/org/telegram/ui/ActionBar/AdjustPanLayoutHelper.java#L39
// and bezier is taken from: https://github.com/DrKLO/Telegram/blob/e9a35cea54c06277c69d41b8e25d94b5d7ede065/TMessagesProj/src/main/java/androidx/recyclerview/widget/ChatListItemAnimator.java#L40
const TELEGRAM_ANDROID_TIMING_CONFIG = {
  duration: 250,
  easing: Easing.bezier(
    0.19919472913616398,
    0.010644531250000006,
    0.27920937042459737,
    0.91025390625
  ),
};
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
  const animatedKeyboardHeight = useSharedValue(0);

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

  useKeyboardHandler(
    {
      onStart: (e) => {
        'worklet';

        if (e.height > 0) {
          // just persist height - later will be used in interpolation
          keyboardHeight.value = e.height;
        }
        // if we are running on Android < 9, then we are using custom interpolation
        // to achieve smoother animation and use `animatedKeyboardHeight` as animation
        // driver
        if (!IS_ANDROID_ELEVEN_OR_HIGHER_OR_IOS) {
          animatedKeyboardHeight.value = withTiming(
            e.height,
            TELEGRAM_ANDROID_TIMING_CONFIG
          );
        }
      },
      onMove: (e) => {
        'worklet';

        // if animation will be smooth - we can handle it here
        // otherwise we'll use a `animatedKeyboardHeight` value
        // in `useDerivedValue`
        if (IS_ANDROID_ELEVEN_OR_HIGHER_OR_IOS) {
          maybeScroll(e.height);
        }
      },
      onEnd: (e) => {
        'worklet';

        keyboardHeight.value = e.height;
      },
    },
    [height]
  );

  useDerivedValue(() => {
    if (!IS_ANDROID_ELEVEN_OR_HIGHER_OR_IOS) {
      maybeScroll(animatedKeyboardHeight.value);
    }
  }, []);

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
