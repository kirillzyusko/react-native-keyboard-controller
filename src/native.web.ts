import { View } from 'react-native';

const NOOP = () => {};
export const KeyboardController = {
  setDefaultMode: NOOP,
  setInputMode: NOOP,
};
export const KeyboardEvents = {
  addListener: () => NOOP,
};
export const KeyboardControllerView = View;
export const KeyboardGestureArea = View;
