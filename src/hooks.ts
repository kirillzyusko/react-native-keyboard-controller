import { useContext, useEffect, useMemo } from 'react';

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

/**
 * // 1. add listener to context
 * // 2. useMemo here?
 * // 3. remove listener from context on unmount
 */
export function useKeyboardHandler(
  handler: KeyboardHandler,
  deps?: ReadonlyArray<unknown>
) {
  // TODO: ideally this hook should be splitted in two hooks (first just works with context, second combines first and set adjustResize)
  useResizeMode(); // TODO: we need to switch to adjustResize - is it good enough to use this hook here?
  const context = useContext(KeyboardContext);
  // TODO: do we need memo here?
  const memoizedHandler = useMemo(() => handler, deps);

  useEffect(() => {
    const key = uuid();

    context.setHandlers({ [key]: handler });

    return () => {
      context.setHandlers({ [key]: undefined });
    };
  }, [memoizedHandler]);
}
