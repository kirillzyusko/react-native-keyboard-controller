import { useEffect, useState } from "react";

import { KeyboardEvents } from "../../bindings";
import { KeyboardController } from "../../module";

const EVENTS = ["keyboardDidShow", "keyboardDidHide"] as const;

// TODO: expose isVisible, isTransitioning (isHiding/isShowing) props?
export const useKeyboardState = () => {
  const [state, setState] = useState(() => KeyboardController.state());

  useEffect(() => {
    const subscriptions = EVENTS.map((event) =>
      KeyboardEvents.addListener(event, setState),
    );

    // we might have missed an update between reading a value in render and
    // `addListener` in this handler, so we set it here. If there was
    // no change, React will filter out this update as a no-op.
    setState(KeyboardController.state());

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, []);

  return state;
};
