import { useEffect, useState } from "react";

import { KeyboardEvents } from "../../bindings";
import { KeyboardController } from "../../module";

import type { KeyboardState } from "../../types";

const EVENTS = ["keyboardDidShow", "keyboardDidHide"] as const;

const getLatestState = () => ({
  ...KeyboardController.state(),
  isVisible: KeyboardController.isVisible(),
});

type KeyboardStateSelector<T> = (state: KeyboardState) => T;

/**
 * React Hook that represents the current keyboard state on iOS and Android.
 * It tracks keyboard visibility, height, appearance, type and other properties.
 * This hook subscribes to keyboard events and updates the state reactively.
 *
 * @param selector - a function that receives the current keyboard state and picks only necessary properties to avoid frequent re-renders.
 * @returns Object {@link KeyboardState|containing} keyboard state information.
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-state|Documentation} page for more details.
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
function useKeyboardState<T>(
  selector: KeyboardStateSelector<T> = (state) => state as T,
): T {
  const [state, setState] = useState<T>(() => selector(getLatestState()));

  useEffect(() => {
    const subscriptions = EVENTS.map((event) =>
      KeyboardEvents.addListener(event, () =>
        // state will be updated by global listener first,
        // so we simply read it and don't derive data from the event
        setState(selector(getLatestState())),
      ),
    );

    // we might have missed an update between reading a value in render and
    // `addListener` in this handler, so we set it here. If there was
    // no change, React will filter out this update as a no-op.
    setState(selector(getLatestState()));

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, []);

  return state;
}

export { useKeyboardState };
