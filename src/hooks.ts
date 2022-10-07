import { useContext, useEffect } from 'react';

import { AnimatedContext, KeyboardContext, ReanimatedContext } from './context';
import { AndroidSoftInputModes, KeyboardController } from './native';

export const useResizeMode = () => {
  useEffect(() => {
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE
    );

    return () => KeyboardController.setDefaultMode();
  }, []);
};

export const useKeyboardAnimation = (): AnimatedContext => {
  useResizeMode();
  const context = useContext(KeyboardContext);

  return context.animated;
};

export const useReanimatedKeyboardAnimation = (): ReanimatedContext => {
  useResizeMode();
  const context = useContext(KeyboardContext);

  return context.reanimated;
};
