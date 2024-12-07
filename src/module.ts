import { KeyboardControllerNative, KeyboardEvents } from "./bindings";

import type { DismissOptions, KeyboardControllerModule } from "./types";

let isClosed = false;

KeyboardEvents.addListener("keyboardDidHide", () => {
  isClosed = true;
});

KeyboardEvents.addListener("keyboardDidShow", () => {
  isClosed = false;
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

export const KeyboardController: KeyboardControllerModule = {
  setDefaultMode: KeyboardControllerNative.setDefaultMode,
  setInputMode: KeyboardControllerNative.setInputMode,
  setFocusTo: KeyboardControllerNative.setFocusTo,
  dismiss: dismiss,
  isVisible,
};
