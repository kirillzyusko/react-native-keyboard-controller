import { act, renderHook } from "@testing-library/react-native";

import { useKeyboardState } from "..";

import type { KeyboardEventData } from "../../../types";

type KeyboardEventName =
  | "keyboardWillShow"
  | "keyboardDidShow"
  | "keyboardWillHide"
  | "keyboardDidHide";
type Listener = (event: KeyboardEventData) => void;

jest.mock("../../../bindings", () => {
  const listeners = new Map<KeyboardEventName, Set<Listener>>();

  return {
    KeyboardControllerNative: { dismiss: jest.fn() },
    KeyboardEvents: {
      addListener: (name: KeyboardEventName, listener: Listener) => {
        const named = listeners.get(name) ?? new Set<Listener>();

        named.add(listener);
        listeners.set(name, named);

        return { remove: () => named.delete(listener) };
      },
    },
    emit: (name: KeyboardEventName, event: KeyboardEventData) =>
      listeners.get(name)?.forEach((listener) => listener(event)),
  };
});

const { emit } = jest.requireMock<{
  emit: (name: KeyboardEventName, event: KeyboardEventData) => void;
}>("../../../bindings");

const keyboard = (name: KeyboardEventName, height: number) =>
  act(() =>
    emit(name, {
      height,
      duration: 0,
      timestamp: 0,
      target: 1,
      type: "default",
      appearance: "light",
    }),
  );

describe("useKeyboardState", () => {
  it("is visible again when Android re-syncs the keyboard with `keyboardDidShow` alone", () => {
    const { result } = renderHook(() => useKeyboardState());

    keyboard("keyboardWillShow", 300);
    keyboard("keyboardDidHide", 0);
    keyboard("keyboardDidShow", 300);

    expect(result.current).toMatchObject({ isVisible: true, height: 300 });
  });
});
