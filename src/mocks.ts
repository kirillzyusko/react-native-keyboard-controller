import { View } from 'react-native';

const NOOP = () => {};
const KeyboardControllerView = View;
const useKeyboardAnimation = NOOP;
const useReanimatedKeyboardAnimation = NOOP;
const useResizeMode = NOOP;
const useGenericKeyboardHandler = NOOP;
const useKeyboardHandler = NOOP;
const KeyboardController = {
  setInputMode: () => {},
  setDefaultMode: () => {},
};
const KeyboardEvents = {
  addListener: () => ({ remove: () => {} }),
};

export default {
  // hooks
  useKeyboardAnimation,
  useReanimatedKeyboardAnimation,
  useResizeMode,
  useGenericKeyboardHandler,
  useKeyboardHandler,
  // modules
  KeyboardController,
  KeyboardEvents,
  // views
  KeyboardControllerView,
} as const;
