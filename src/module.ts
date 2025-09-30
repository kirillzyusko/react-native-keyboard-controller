import { KeyboardControllerNative, KeyboardEvents } from "./bindings";

import type {
  DismissOptions,
  KeyboardControllerModule,
  KeyboardEventData,
} from "./types";

let isClosed = true;
let lastState: KeyboardEventData = {
  height: 0,
  duration: 0,
  timestamp: new Date().getTime(),
  target: -1,
  type: "default",
  appearance: "light",
};

KeyboardEvents.addListener("keyboardDidHide", (e) => {
  isClosed = true;
  lastState = e;
});

KeyboardEvents.addListener("keyboardDidShow", (e) => {
  isClosed = false;
  lastState = e;
});

const dismiss = async (options?: Partial<DismissOptions>): Promise<void> => {
  const keepFocus = options?.keepFocus ?? false;
  const animated = options?.animated ?? true;

  return new Promise((resolve) => {
    if (isClosed) {
      resolve();

      return;
    }

    const subscription = KeyboardEvents.addListener("keyboardDidHide", () => {
      resolve(undefined);
      subscription.remove();
    });

    KeyboardControllerNative.dismiss(keepFocus, animated);
  });
};
const isVisible = () => !isClosed;
const state = () => lastState;

/**
 * KeyboardController module. Helps to perform imperative actions/checks with keyboard.
 */
export const KeyboardController: KeyboardControllerModule = {
  setDefaultMode: KeyboardControllerNative.setDefaultMode,
  setInputMode: KeyboardControllerNative.setInputMode,
  setFocusTo: KeyboardControllerNative.setFocusTo,
  preload: KeyboardControllerNative.preload,
  dismiss,
  isVisible,
  state,
};
