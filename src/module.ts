import { KeyboardControllerNative, KeyboardEvents } from "./bindings";

import type { KeyboardControllerModule } from "./types";

let isClosed = false;

KeyboardEvents.addListener("keyboardDidHide", () => {
  isClosed = true;
});

KeyboardEvents.addListener("keyboardDidShow", () => {
  isClosed = false;
});

const dismiss = async (): Promise<void> => {
  return new Promise((resolve) => {
    if (isClosed) {
      resolve();

      return;
    }

    const subscription = KeyboardEvents.addListener("keyboardDidHide", () => {
      resolve(undefined);
      subscription.remove();
    });

    KeyboardControllerNative.dismiss();
  });
};
const isVisible = () => !isClosed;

export const KeyboardController: KeyboardControllerModule = {
  setDefaultMode: KeyboardControllerNative.setDefaultMode,
  setInputMode: KeyboardControllerNative.setInputMode,
  setFocusTo: KeyboardControllerNative.setFocusTo,
  dismiss: dismiss,
  isVisible,
};
