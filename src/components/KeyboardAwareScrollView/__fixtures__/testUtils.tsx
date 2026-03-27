import { act, render } from "@testing-library/react-native";
import React from "react";
import { View } from "react-native";

import type { LayoutChangeEvent } from "react-native";
import type {
  FocusedInputLayoutChangedEvent,
  FocusedInputSelectionChangedEvent,
  NativeEvent,
} from "react-native-keyboard-controller";
import type { SharedValue } from "react-native-reanimated";

// ---------------------------------------------------------------------------
// Constants (derived from real device logs)
// ---------------------------------------------------------------------------
export const MOCK_SCREEN_HEIGHT = 928;
export const KEYBOARD_HEIGHT = 312;
export const BOTTOM_OFFSET = 62;
export const MOCK_SV_TARGET = 1469;
export const MOCK_SV_PAGE_Y = 116;
export const INPUT_TARGET_A = 1373;
export const INPUT_TARGET_B = 1395;

export const INPUT_LAYOUT_A = {
  absoluteY: 281.67,
  height: 60.33,
  y: 165.67,
  x: 0,
  absoluteX: 16,
  width: 394.67,
};

export const INPUT_LAYOUT_B = {
  absoluteY: 695.67,
  height: 60.33,
  y: 579.67,
  x: 0,
  absoluteX: 16,
  width: 121,
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type KeyboardHandlers = {
  onStart: (e: NativeEvent) => void;
  onMove: (e: NativeEvent) => void;
  onEnd: (e: NativeEvent) => void;
};

export type SelectionHandler = (e: FocusedInputSelectionChangedEvent) => void;

// ---------------------------------------------------------------------------
// Mock state
// ---------------------------------------------------------------------------
export const mockScrollTo = jest.fn();
export const mockInput = {
  value: null,
} as SharedValue<FocusedInputLayoutChangedEvent | null>;
export const mockOffset = { value: 0 } as SharedValue<number>;
export const mockLayout = {
  value: { width: 390, height: 812 },
} as SharedValue<{ width: number; height: number }>;
export const mockSize = {
  value: { width: 390, height: 2000 },
} as SharedValue<{ width: number; height: number }>;

// ---------------------------------------------------------------------------
// Captured handlers (populated on each render)
// ---------------------------------------------------------------------------
export const mockKeyboardHandlers: { current: KeyboardHandlers } = {
  current: undefined as unknown as KeyboardHandlers,
};
export const mockSelectionHandler: { current: SelectionHandler } = {
  current: undefined as unknown as SelectionHandler,
};
export const mockCapturedOnLayout: {
  current: ((e: LayoutChangeEvent) => void) | null;
} = { current: null };

// ---------------------------------------------------------------------------
// Re-export shared utilities
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export const reset = () => {
  mockScrollTo.mockClear();
  mockOffset.value = 0;
  mockLayout.value = { width: 390, height: 812 };
  mockSize.value = { width: 390, height: 2000 };
  mockInput.value = null;
  mockCapturedOnLayout.current = null;
};

export const inputEvent = (
  target: number,
  layout: typeof INPUT_LAYOUT_A,
): FocusedInputLayoutChangedEvent => ({
  target,
  parentScrollViewTarget: MOCK_SV_TARGET,
  layout: { ...layout },
});

export const selectionEvent = (
  target: number,
  endY = 47,
  endPosition = 0,
): FocusedInputSelectionChangedEvent => ({
  target,
  selection: {
    start: { x: 0, y: endY, position: endPosition },
    end: { x: 0, y: endY, position: endPosition },
  },
});

export const kbEvent = (height: number, target: number): NativeEvent => ({
  height,
  target,
  duration: 285,
  progress: KEYBOARD_HEIGHT > 0 ? height / KEYBOARD_HEIGHT : 0,
});

export const renderKeyboardAwareScrollView = async (
  bottomOffset = BOTTOM_OFFSET,
) => {
  const KeyboardAwareScrollView = require("../index").default;

  render(
    <KeyboardAwareScrollView bottomOffset={bottomOffset}>
      <View />
    </KeyboardAwareScrollView>,
  );

  await act(async () => {
    mockCapturedOnLayout.current?.({
      nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 812 } },
    } as LayoutChangeEvent);
  });
};

export const lastScrollToY = (): number | undefined => {
  const calls = mockScrollTo.mock.calls;

  if (calls.length === 0) {
    return undefined;
  }

  // scrollTo(ref, x, y, animated)
  return calls[calls.length - 1][2] as number;
};
