import { useEffect, useState } from "react";

import { KeyboardEvents } from "../../bindings";
import { KeyboardController } from "../../module";

import type { KeyboardState } from "../../types";

const EVENTS = ["keyboardDidShow", "keyboardDidHide"] as const;

const getLatestState = () => ({
  ...KeyboardController.state(),
  isVisible: KeyboardController.isVisible(),
});

/**
 * Hook that provides the current keyboard state.
 * Returns an object containing information about the keyboard's visibility,
 * height, duration, and other properties.
 *
 * @returns Object {@link KeyboardState|containing} keyboard state information.
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isVisible, height } = useKeyboardState();
 *   return (
 *     <View>
 *       <Text>Keyboard is {isVisible ? 'visible' : 'hidden'}</Text>
 *       <Text>Keyboard height: {height}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export const useKeyboardState = (): KeyboardState => {
  const [state, setState] = useState(getLatestState);

  useEffect(() => {
    const subscriptions = EVENTS.map((event) =>
      KeyboardEvents.addListener(event, () =>
        // state will be updated by global listener first,
        // so we simply read it and don't derive data from the event
        setState(getLatestState),
      ),
    );

    // we might have missed an update between reading a value in render and
    // `addListener` in this handler, so we set it here. If there was
    // no change, React will filter out this update as a no-op.
    setState(getLatestState);

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, []);

  return state;
};
