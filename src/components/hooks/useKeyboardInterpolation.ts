import {
  interpolate as interpolateREA,
  useSharedValue,
} from "react-native-reanimated";

import { useKeyboardHandler } from "../../hooks";

type KeyboardInterpolationOutput = [number, number];

/**
 * Hook that can be used for interpolation keyboard movement. The main concern is the thing
 * when keyboard is opened and gets resized on Android. Let's say we are interpolating from
 * closed to open [0, 200] and we want to interpolate it to [0, 230] (to achieve nice parallax effect).
 * Then let's say keyboard changes its height to 220 (and we want to interpolate the value to 250, +30
 * to keyboard height). If we interpolate based on `progress` value, then we will have a jump on first frame:
 * the last interpolated position was 230, now we will interpolate to 250, but first frame will be calculated
 * as 200 / 220 * 250 = 227 (and last interpolated position was 230) so we will have a jump.
 *
 * This hook handles it, and when keyboard changes its size it does an interpolation as:
 * [200, 220] -> [230, 250], i. e. we preserve last interpolated value and use it as initial value for interpolation
 * and because of that we will not have a jump and animation will start from the last frame and will be smooth.
 *
 * @see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/315
 */
const useKeyboardInterpolation = () => {
  // keyboard heights
  const currentKeyboardHeight = useSharedValue(0);
  const nextKeyboardHeight = useSharedValue(0);
  const prevKeyboardHeight = useSharedValue(0);
  // save latest interpolated position
  const lastInterpolation = useSharedValue(0);
  // boolean flag indicating which output range should be used
  const shouldUseInternalInterpolation = useSharedValue(false);

  const interpolate = (output: KeyboardInterpolationOutput) => {
    "worklet";

    lastInterpolation.value = interpolateREA(
      currentKeyboardHeight.value,
      [prevKeyboardHeight.value, nextKeyboardHeight.value],
      shouldUseInternalInterpolation.value
        ? [lastInterpolation.value, output[1]]
        : output,
    );
    return lastInterpolation.value;
  };

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        if (e.height === 0) {
          shouldUseInternalInterpolation.value = false;
          prevKeyboardHeight.value = 0;
        }

        if (nextKeyboardHeight.value !== 0 && e.height > 0) {
          prevKeyboardHeight.value = nextKeyboardHeight.value;
          shouldUseInternalInterpolation.value = true;
        }

        if (e.height > 0) {
          nextKeyboardHeight.value = e.height;
        }
      },
      onMove: (e) => {
        "worklet";

        currentKeyboardHeight.value = e.height;
      },
      onEnd: (e) => {
        "worklet";

        nextKeyboardHeight.value = e.height;
      },
    },
    [],
  );

  return { interpolate };
};

export default useKeyboardInterpolation;
