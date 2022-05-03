import { interpolate } from 'react-native-reanimated';

export const defaultLinearInterpolator = (
  finger: number,
  _: number,
  keyboardHeight: number
) => {
  'worklet';

  return {
    position: interpolate(finger, [0, keyboardHeight], [keyboardHeight, 0]),
    opacity: 1,
  };
};

export const iOSInteractiveKeyboard = (
  finger: number,
  distanceToKeyboard: number,
  keyboardHeight: number
) => {
  'worklet';

  // console.log(121212, finger, distanceToKeyboard, keyboardHeight);

  return {
    position: interpolate(
      finger,
      [0, distanceToKeyboard, distanceToKeyboard + keyboardHeight],
      [keyboardHeight, keyboardHeight, 0]
    ),
    opacity: 1,
  };
};
