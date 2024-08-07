import type { FocusedInputHandler, KeyboardHandler } from "./types";

export const keyboardEventsMap = new Map<keyof KeyboardHandler, string>([
  ["onStart", "onKeyboardMoveStart"],
  ["onMove", "onKeyboardMove"],
  ["onEnd", "onKeyboardMoveEnd"],
  ["onInteractive", "onKeyboardMoveInteractive"],
]);
export const focusedInputEventsMap = new Map<keyof FocusedInputHandler, string>(
  [
    ["onChangeText", "onFocusedInputTextChanged"],
    ["onSelectionChange", "onFocusedInputSelectionChanged"],
  ],
);
