import { KeyboardControllerNative, KeyboardEvents } from "./bindings";

import type {
  DismissOptions,
  KeyboardControllerModule,
  KeyboardEventData,
} from "./types";

let isClosed = false;
let lastEvent: KeyboardEventData | null = null;

KeyboardEvents.addListener("keyboardDidHide", (e) => {
  isClosed = true;
  lastEvent = e;
});

KeyboardEvents.addListener("keyboardDidShow", (e) => {
  isClosed = false;
  lastEvent = e;
});

const dismiss = async (
  { keepFocus }: DismissOptions = { keepFocus: false },
): Promise<void> => {
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
