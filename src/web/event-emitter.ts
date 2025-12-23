import { DeviceEventEmitter } from "react-native";

import { DURATION } from "./constants";
import FocusedInputHolder from "./FocusedInputHolder";

const emitEvent = (eventName: string, height: number) => {
  const input = FocusedInputHolder.get();

  DeviceEventEmitter.emit(`KeyboardController::${eventName}`, {
    height: height,
    duration: DURATION,
    timestamp: new Date().getTime(),
    target: input,
    type: input?.inputMode || "default",
    appearance: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  });
};

if ("virtualKeyboard" in navigator) {
  navigator.virtualKeyboard.addEventListener("geometrychange", (event) => {
    const { height: keyboardHeight } = event.target.boundingRect;

    if (keyboardHeight > 0) {
      emitEvent("keyboardWillShow", keyboardHeight);
      setTimeout(() => {
        emitEvent("keyboardDidShow", keyboardHeight);
      }, DURATION);
    } else {
      emitEvent("keyboardWillHide", keyboardHeight);
      setTimeout(() => {
        emitEvent("keyboardDidHide", keyboardHeight);
      }, DURATION);
    }
  });
}
