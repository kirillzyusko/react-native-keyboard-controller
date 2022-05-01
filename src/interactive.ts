import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import {
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import { useMetaContext } from './animated';
import { useKeyboardMetrics } from './utils';
import { useGradualKeyboardAnimation } from './replicas';

type InternalGestureContext = {
  start: number;
};

const screenHeight = Dimensions.get('window').height;

export const useInteractiveKeyboardAnimation = (ref) => {
  const keyboardUnderGesture = useSharedValue(false);
  const underGesture = useSharedValue(false);
  const { height, progress } = useGradualKeyboardAnimation();
  const { touch } = useMetaContext();

  const keyboardHeight = useKeyboardMetrics();

  const keyboard = useDerivedValue(
    // keyboardUnderGesture.value
    () => (underGesture.value ? keyboardHeight.value : height.value),
    []
  );

  useAnimatedReaction(
    () => ({
      _keyboardUnderGesture: keyboardUnderGesture.value,
    }),
    (result, _previousResult) => {
      const { _keyboardUnderGesture } = result;
      const _previousKeyboardUnderGesture =
        _previousResult?._keyboardUnderGesture;

      if (_keyboardUnderGesture !== _previousKeyboardUnderGesture) {
        console.log(11111, _keyboardUnderGesture);
        // scrollTo(ref, 0, 0, false);
      }
    }
  );

  const handler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    InternalGestureContext
  >({
    onStart: (e, ctx) => {
      ctx.start = e.y;
      underGesture.value = true;
    },
    onActive: (e, ctx) => {
      const isScrollDown = ctx.start - e.y < 0;
      const absoluteScroll = Math.abs(ctx.start - e.y);
      const distanceToKeyboard =
        screenHeight - Math.abs(keyboardHeight.value) - touch.value;
      const shouldMoveKeyboard = absoluteScroll > distanceToKeyboard;
      keyboardUnderGesture.value = shouldMoveKeyboard && isScrollDown;

      if (keyboardUnderGesture.value) {
        const dY = keyboardHeight.value + (absoluteScroll - distanceToKeyboard);
        // console.log(33333, dY);
        height.value = dY;
        // scrollTo(ref, 0, -100, false);
      }
      // console.debug(22222, distanceToKeyboard, absoluteScroll);
    },
    onEnd: () => {
      keyboardUnderGesture.value = false;
      underGesture.value = false;
    },
    onCancel: () => {
      keyboardUnderGesture.value = false;
      underGesture.value = false;
    },
    onFail: () => {
      keyboardUnderGesture.value = false;
      underGesture.value = false;
    },
    onFinish: () => {
      keyboardUnderGesture.value = false;
      underGesture.value = false;
    },
  });

  return { height, progress, handler, keyboard };
};
