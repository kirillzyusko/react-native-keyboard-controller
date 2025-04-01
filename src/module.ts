import { KeyboardControllerNative, KeyboardEvents } from "./bindings";

import type {
  DismissOptions,
  KeyboardControllerModule,
  KeyboardEventData,
  KeyboardState,
} from "./types";

let isClosed = true;
let lastEvent: KeyboardState | null = null;

const getKeyboardStateFromEvent = (
  event: KeyboardEventData | null,
): KeyboardState | null => {
  if (event === null) {
    return null;
  }

  return {
    isVisible: event.height > 0,
    ...event,
  };
};

KeyboardEvents.addListener("keyboardDidHide", (e) => {
  isClosed = true;
  lastEvent = getKeyboardStateFromEvent(e);
});

KeyboardEvents.addListener("keyboardDidShow", (e) => {
  isClosed = false;
  lastEvent = getKeyboardStateFromEvent(e);
});

const dismiss = async (options?: DismissOptions): Promise<void> => {
  const keepFocus = options?.keepFocus ?? false;

  return new Promise((resolve) => {
    if (isClosed) {
      resolve();

      return;
    }

    const subscription = KeyboardEvents.addListener("keyboardDidHide", () => {
      resolve(undefined);
      subscription.remove();
    });

    KeyboardControllerNative.dismiss(keepFocus);
  });
};
const isVisible = () => !isClosed;
const state = () => lastEvent;

export const KeyboardController: KeyboardControllerModule = {
  setDefaultMode: KeyboardControllerNative.setDefaultMode,
  setInputMode: KeyboardControllerNative.setInputMode,
  setFocusTo: KeyboardControllerNative.setFocusTo,
  dismiss,
  isVisible,
  state,
};
