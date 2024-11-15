import { KeyboardControllerNative, KeyboardEvents } from "./bindings";

import type { KeyboardControllerModule } from "./types";

let isVisible = false;

KeyboardEvents.addListener("keyboardDidHide", () => {
  isVisible = false;
});

KeyboardEvents.addListener("keyboardDidShow", () => {
  isVisible = true;
});

const dismiss = async (): Promise<void> => {
  return new Promise((resolve) => {
    if (!isVisible) {
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

export const KeyboardController: KeyboardControllerModule = {
  setDefaultMode: KeyboardControllerNative.setDefaultMode,
  setInputMode: KeyboardControllerNative.setInputMode,
  setFocusTo: KeyboardControllerNative.setFocusTo,
  dismiss: dismiss,
};
