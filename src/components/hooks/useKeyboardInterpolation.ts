import { Platform } from "react-native";
import {
  interpolate as interpolateREA,
  useSharedValue,
} from "react-native-reanimated";

import { useKeyboardHandler } from "react-native-keyboard-controller";

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
  const nextKeyboardHeight = useSharedValue(0);
  const prevKeyboardHeight = useSharedValue(0);
  // save latest interpolated position
  const lastInterpolation = useSharedValue(0);
  // boolean flag indicating which output range should be used
  const shouldUseInternalInterpolation = useSharedValue(false);

  const interpolate = (
    keyboardPosition: number,
    output: KeyboardInterpolationOutput,
  ) => {
    "worklet";

    // on iOS it's safe to interpolate between 0 and `fullKeyboardSize` because when
    // keyboard resized we will not have intermediate values and transition will be instant
    // see: https://github.com/kirillzyusko/react-native-keyboard-controller/issues/327
    if (Platform.OS === "ios") {
      return interpolateREA(
        keyboardPosition,
        [0, nextKeyboardHeight.value],
        output,
      );
    }

    lastInterpolation.value = interpolateREA(
      keyboardPosition,
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

        const keyboardWillBeHidden = e.height === 0;

        // keyboard will be hidden
        if (keyboardWillBeHidden) {
          shouldUseInternalInterpolation.value = false;
          prevKeyboardHeight.value = 0;
        }

        // keyboard will change its size
        if (
          // keyboard is shown on screen
          nextKeyboardHeight.value !== 0 &&
          // it really changes size (handles iOS case when after interactive keyboard gets shown again)
          nextKeyboardHeight.value !== e.height &&
          // keyboard is not hiding
          !keyboardWillBeHidden
        ) {
          prevKeyboardHeight.value = nextKeyboardHeight.value;
          shouldUseInternalInterpolation.value = true;
        }

        // keyboard will show or change size
        if (!keyboardWillBeHidden) {
          nextKeyboardHeight.value = e.height;
        }
      },
      onEnd: (e) => {
        "worklet";

        // handles case show -> resize -> hide -> show
        // here we reset value to 0 when keyboard is hidden
        nextKeyboardHeight.value = e.height;
      },
    },
    [],
  );

  return { interpolate };
};

export default useKeyboardInterpolation;
