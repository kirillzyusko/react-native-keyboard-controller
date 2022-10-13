import { createContext } from 'react';
import { Animated } from 'react-native';

import type { SharedValue } from 'react-native-reanimated';
import type { KeyboardHandlers } from './types';

export type AnimatedContext = {
  progress: Animated.Value;
  height: Animated.AnimatedMultiplication<number>;
};
export type ReanimatedContext = {
  progress: SharedValue<number>;
  height: SharedValue<number>;
};
export type KeyboardAnimationContext = {
  animated: AnimatedContext;
  reanimated: ReanimatedContext;
  setHandlers: (handlers: KeyboardHandlers) => void;
};
const defaultContext: KeyboardAnimationContext = {
  animated: {
    progress: new Animated.Value(0),
    height: new Animated.Value(0),
  },
  reanimated: {
    progress: { value: 0 },
    height: { value: 0 },
  },
  setHandlers: () => {},
};
export const KeyboardContext = createContext(defaultContext);
