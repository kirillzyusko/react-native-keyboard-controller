import { Dimensions } from 'react-native';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import {
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useInteractiveKeyboardContext } from './animated';
import { useKeyboardMetrics } from './utils';

type InternalGestureContext = {
  start: number;
};

type Interpolator = (
  finger: number,
  distanceToKeyboard: number,
  keyboardHeight: number
) => {
  opacity: number;
  position: number;
  direction: 'up' | 'down';
};

const screenHeight = Dimensions.get('window').height;

export const useInteractiveKeyboardAnimation = (interpolator: Interpolator) => {
  const animation = useSharedValue(0);
  const { isScrollActive, keyboard } = useInteractiveKeyboardContext();
  const keyboardHeight = { value: 296 }; // keyboard height + bottom insets. useKeyboardMetrics();

  useAnimatedReaction(
    () => {
      return animation.value;
    },
    (result, previous) => {
      if (result !== previous) {
        keyboard.value = {
          position: result,
          opacity: 1,
        };
      }
    },
    []
  );

  const handler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    InternalGestureContext
  >(
    {
      onStart: (e, ctx) => {
        ctx.start = e.y;
        isScrollActive.value = true;
      },
      onActive: (e, ctx) => {
        const finger = e.y - ctx.start;

        /* if (finger > 0) {
        console.log('scrollDown (to keyboard)');
      } else {
        console.log('scrollUp (to header)');
      } */

        keyboard.value = interpolator(
          finger,
          screenHeight - ctx.start - keyboardHeight.value,
          keyboardHeight.value
        );
      },
      // TODO: onCancel, onFinish, onFail?
      onEnd: (e, ctx) => {
        const finger = e.y - ctx.start;
        const { direction, position } = interpolator(
          finger,
          screenHeight - ctx.start - keyboardHeight.value,
          keyboardHeight.value
        );

        animation.value = position;
        animation.value = withTiming(
          direction === 'up' ? keyboardHeight.value : 0
        );
        isScrollActive.value = false;
      },
    },
    []
  );

  return { handler };
};
