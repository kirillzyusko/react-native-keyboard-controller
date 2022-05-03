import { Dimensions } from 'react-native';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { useAnimatedGestureHandler } from 'react-native-reanimated';
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
};

const screenHeight = Dimensions.get('window').height;

export const useInteractiveKeyboardAnimation = (interpolator: Interpolator) => {
  const { isScrollActive, keyboard } = useInteractiveKeyboardContext();
  const keyboardHeight = { value: 281 }; // useKeyboardMetrics();

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
      onEnd: () => {
        // TODO: onCancel, onFinish, onFail?
        isScrollActive.value = false;
      },
    },
    []
  );

  return { handler };
};
