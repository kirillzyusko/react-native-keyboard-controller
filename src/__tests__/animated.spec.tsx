import { act, render } from "@testing-library/react-native";
import { useEffect } from "react";

import { KeyboardProvider } from "../animated";
import { useKeyboardContext } from "../context";

import type { KeyboardAnimationContext } from "../context";

jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const mock = require("react-native-reanimated/mock");

  return {
    ...mock,
    __esModule: true,
    default: {
      createAnimatedComponent: (Component: unknown) => Component,
    },
    useSharedValue: <T,>(initialValue: T) => {
      const ref = React.useRef({ value: initialValue });

      return ref.current;
    },
  };
});

jest.mock("../bindings", () => {
  const { View } = require("react-native");

  return {
    FocusedInputEvents: {
      addListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    KeyboardControllerView: View,
    KeyboardControllerViewCommands: {
      synchronizeFocusedInputLayout: jest.fn(),
    },
    KeyboardEvents: {
      addListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    KeyboardControllerNative: {
      dismiss: jest.fn(),
      preload: jest.fn(),
      setDefaultMode: jest.fn(),
      setFocusTo: jest.fn(),
      setInputMode: jest.fn(),
      setTranslucent: jest.fn(),
    },
  };
});

jest.mock("../internal", () => ({
  ...jest.requireActual("../internal"),
  useEventHandlerRegistration: jest.fn(() => jest.fn(() => jest.fn())),
}));

jest.mock("../reanimated", () => ({
  useAnimatedKeyboardHandler: jest.fn(() => ({})),
  useFocusedInputLayoutHandler: jest.fn(() => ({})),
}));

jest.mock("react-native-is-edge-to-edge", () => ({
  controlEdgeToEdgeValues: jest.fn(),
  isEdgeToEdge: jest.fn(() => false),
}));

type ContextCaptureProps = {
  onContext: (value: KeyboardAnimationContext) => void;
};

/**
 * Captures the provider context exposed to descendant hooks.
 *
 * @param props - Receives each context value after it is committed.
 * @param props.onContext - Callback invoked with the latest context value.
 * @returns No rendered output.
 */
function ContextCapture({ onContext }: ContextCaptureProps) {
  const value = useKeyboardContext();

  useEffect(() => {
    onContext(value);
  }, [onContext, value]);

  return null;
}

describe("KeyboardProvider enabled state", () => {
  it("resets Reanimated keyboard values when disabled mid-transition", () => {
    const capture = jest.fn();

    render(
      <KeyboardProvider>
        <ContextCapture onContext={capture} />
      </KeyboardProvider>,
    );
    const context = capture.mock.lastCall![0] as KeyboardAnimationContext;

    act(() => {
      context.reanimated.progress.value = 0.5;
      context.reanimated.height.value = -150;
      context.setEnabled(false);
    });

    expect(context.reanimated.progress.value).toBe(0);
    expect(context.reanimated.height.value).toBe(0);
  });
});
