import { DependencyList, useContext, useEffect } from 'react';

import { AnimatedContext, KeyboardContext, ReanimatedContext } from './context';
import { AndroidSoftInputModes, KeyboardController } from './native';
import { uuid } from './utils';

import type { KeyboardHandler } from './types';

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

export function useGenericKeyboardHandler(
  handler: KeyboardHandler,
  deps?: DependencyList
) {
  const context = useContext(KeyboardContext);

  useEffect(() => {
    const key = uuid();

    context.setHandlers({ [key]: handler });

    return () => {
      context.setHandlers({ [key]: undefined });
    };
  }, deps);
}

export function useKeyboardHandler(
  handler: KeyboardHandler,
  deps?: DependencyList
) {
  useResizeMode();
  useGenericKeyboardHandler(handler, deps);
}
