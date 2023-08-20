import { View } from 'react-native';
import type { KeyboardControllerModule } from './types';

const NOOP = () => {};
export const KeyboardController: KeyboardControllerModule = {
  setDefaultMode: NOOP,
  setInputMode: NOOP,
  addListener: NOOP,
  removeListeners: NOOP,
};
export const KeyboardEvents = {
  addListener: () => NOOP,
};
export const KeyboardControllerView = View;
export const KeyboardGestureArea = View;
