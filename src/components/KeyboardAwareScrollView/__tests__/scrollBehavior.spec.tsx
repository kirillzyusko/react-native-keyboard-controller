import React from "react";
import { View } from "react-native";
import { render, act } from "@testing-library/react-native";

// ---------------------------------------------------------------------------
// Constants (derived from real device logs)
// ---------------------------------------------------------------------------
const SCREEN_HEIGHT = 844;
const KEYBOARD_HEIGHT = 291;
const SV_TARGET = 769; // scrollView native handle
const INPUT_TARGET = 765; // TextInput native handle

const INPUT_LAYOUT = {
  absoluteY: 541,
  height: 360,
  y: 450,
  x: 0,
  absoluteX: 0,
  width: 390,
};

// ---------------------------------------------------------------------------
// Mocks – state
// ---------------------------------------------------------------------------
const mockScrollTo = jest.fn();
const mockInput: { value: any } = { value: null };
const mockOffset: { value: number } = { value: 0 };
const mockLayout: { value: { width: number; height: number } } = {
  value: { width: 390, height: 753 },
};
const mockSize: { value: { width: number; height: number } } = {
  value: { width: 390, height: 2000 },
};

let capturedOnLayout: ((e: any) => void) | null = null;

// ---------------------------------------------------------------------------
// Mocks – modules
// ---------------------------------------------------------------------------

function mockInterpolate(
  value: number,
  input: number[],
  output: number[],
): number {
  "worklet";

  if (input[1] === input[0]) {
    return output[0];
  }

  const progress = (value - input[0]) / (input[1] - input[0]);

  return output[0] + progress * (output[1] - output[0]);
}

jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  scrollTo: (...args: any[]) => mockScrollTo(...args),
  interpolate: mockInterpolate,
  clamp: (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max),
}));

let keyboardHandlers: {
  onStart: (e: any) => void;
  onMove: (e: any) => void;
  onEnd: (e: any) => void;
};
jest.mock("../useSmoothKeyboardHandler", () => ({
  useSmoothKeyboardHandler: jest.fn((h: any) => {
    keyboardHandlers = h;
  }),
}));

let selectionHandler: (e: any) => void;
jest.mock("../../../hooks", () => ({
  useFocusedInputHandler: jest.fn((h: any) => {
    selectionHandler = h.onSelectionChange;
  }),
  useReanimatedFocusedInput: jest.fn(() => ({
    input: mockInput,
    update: jest.fn().mockResolvedValue(undefined),
  })),
  useWindowDimensions: jest.fn(() => ({ height: SCREEN_HEIGHT })),
}));

jest.mock("../../hooks/useScrollState", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    offset: mockOffset,
    layout: mockLayout,
    size: mockSize,
  })),
}));

jest.mock("../../hooks/useCombinedRef", () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
}));

jest.mock("../../../utils/findNodeHandle", () => ({
  findNodeHandle: jest.fn(() => SV_TARGET),
}));

jest.mock("../../../bindings", () => ({
  KeyboardControllerNative: {
    viewPositionInWindow: jest.fn().mockResolvedValue({ y: 0 }),
  },
}));

jest.mock("../../ScrollViewWithBottomPadding", () => {
  const { forwardRef } = require("react");
  const RN = require("react-native");

  return {
    __esModule: true,
    default: forwardRef((props: any, ref: any) => {
      capturedOnLayout = props.onLayout;

      return <RN.View ref={ref}>{props.children}</RN.View>;
    }),
  };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function inputEvent(overrides: Record<string, any> = {}) {
  return {
    target: INPUT_TARGET,
    parentScrollViewTarget: SV_TARGET,
    layout: { ...INPUT_LAYOUT },
    ...overrides,
  };
}

function selectionEvent(
  target = INPUT_TARGET,
  endY = 123,
  endPosition = 338,
) {
  return {
    target,
    selection: {
      start: { x: 0, y: endY, position: endPosition },
      end: { x: 0, y: endY, position: endPosition },
    },
  };
}

function kbEvent(height: number, target = INPUT_TARGET) {
  return {
    height,
    target,
    duration: 250,
    progress: KEYBOARD_HEIGHT > 0 ? height / KEYBOARD_HEIGHT : 0,
  };
}

function resetMocks() {
  mockScrollTo.mockClear();
  mockOffset.value = 0;
  mockLayout.value = { width: 390, height: 753 };
  mockSize.value = { width: 390, height: 2000 };
  mockInput.value = null;
  capturedOnLayout = null;
}

/**
 * Render the component and trigger onLayout so that `scrollViewTarget` is set.
 */
async function renderKASV() {
  const KeyboardAwareScrollView = require("../index").default;

  render(
    <KeyboardAwareScrollView>
      <View />
    </KeyboardAwareScrollView>,
  );

  // Trigger onLayout to set scrollViewTarget via findNodeHandle
  await act(async () => {
    capturedOnLayout?.({
      nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 753 } },
    });
  });
}

/** Return the `y` argument of the most recent `scrollTo` call, or undefined. */
function lastScrollToY(): number | undefined {
  const calls = mockScrollTo.mock.calls;

  if (calls.length === 0) {
    return undefined;
  }

  // scrollTo(ref, x, y, animated)
  return calls[calls.length - 1][2];
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  resetMocks();
});

describe("KeyboardAwareScrollView scroll behavior", () => {
  describe("iOS 16+: onSelectionChange → onStart → onMove → onEnd", () => {
    it("should scroll to correct position using selection-corrected height", async () => {
      await renderKASV();
      mockInput.value = inputEvent();

      // 1. Selection arrives BEFORE onStart (iOS 16+ behavior)
      selectionHandler(selectionEvent());

      // 2. Keyboard starts showing
      keyboardHandlers.onStart(kbEvent(KEYBOARD_HEIGHT));

      // 3. Simulate final onMove frame at full keyboard height
      mockScrollTo.mockClear();
      keyboardHandlers.onMove(kbEvent(KEYBOARD_HEIGHT));

      // point = 541 + 123 = 664
      // relativeScrollTo = 291 - (844 - 664) + 0 = 111
      // targetScrollY = 111 + 0 = 111
      expect(lastScrollToY()).toBeCloseTo(111, 0);

      keyboardHandlers.onEnd(kbEvent(KEYBOARD_HEIGHT));
    });
  });

  describe("iOS 15: onStart → onSelectionChange → onMove → onEnd", () => {
    it("should use deferred selection and scroll correctly", async () => {
      await renderKASV();
      mockInput.value = inputEvent();

      // 1. Keyboard starts BEFORE selection (iOS 15 behavior)
      keyboardHandlers.onStart(kbEvent(KEYBOARD_HEIGHT));

      // 2. Selection arrives after onStart
      selectionHandler(selectionEvent());

      // 3. Final onMove frame
      mockScrollTo.mockClear();
      keyboardHandlers.onMove(kbEvent(KEYBOARD_HEIGHT));

      // Must use selection-corrected height (123), not full input (360)
      expect(lastScrollToY()).toBeCloseTo(111, 0);

      keyboardHandlers.onEnd(kbEvent(KEYBOARD_HEIGHT));
    });
  });

  describe("iOS 15: refocus same input after keyboard hide", () => {
    it("should use fresh selection data on refocus", async () => {
      await renderKASV();
      mockInput.value = inputEvent();

      // ---- First focus (cursor at y=123) ----
      keyboardHandlers.onStart(kbEvent(KEYBOARD_HEIGHT));
      selectionHandler(selectionEvent(INPUT_TARGET, 123, 338));
      keyboardHandlers.onMove(kbEvent(KEYBOARD_HEIGHT));
      keyboardHandlers.onEnd(kbEvent(KEYBOARD_HEIGHT));
      mockOffset.value = 111;

      // ---- Keyboard hide ----
      keyboardHandlers.onStart(kbEvent(0));
      keyboardHandlers.onEnd(kbEvent(0));
      mockOffset.value = 0;

      // ---- Second focus (cursor moved to y=273) ----
      mockScrollTo.mockClear();

      keyboardHandlers.onStart(kbEvent(KEYBOARD_HEIGHT));
      // Fresh selection arrives with a different cursor position
      selectionHandler(selectionEvent(INPUT_TARGET, 273, 736));
      keyboardHandlers.onMove(kbEvent(KEYBOARD_HEIGHT));

      // Should use fresh selection height (273), not stale (123)
      // point = 541 + 273 = 814
      // relativeScrollTo = 291 - (844 - 814) + 0 = 261
      // targetScrollY = 261 + 0 = 261
      expect(lastScrollToY()).toBeCloseTo(261, 0);

      keyboardHandlers.onEnd(kbEvent(KEYBOARD_HEIGHT));
    });
  });

  describe("Android: refocus same input, selection not re-emitted", () => {
    it("should use stale selection as fallback when no new selection arrives", async () => {
      await renderKASV();
      mockInput.value = inputEvent();

      // ---- First focus (selection arrives) ----
      selectionHandler(selectionEvent(INPUT_TARGET, 123, 338));
      keyboardHandlers.onStart(kbEvent(KEYBOARD_HEIGHT));
      keyboardHandlers.onMove(kbEvent(KEYBOARD_HEIGHT));
      keyboardHandlers.onEnd(kbEvent(KEYBOARD_HEIGHT));
      mockOffset.value = 111;

      // ---- Keyboard hide ----
      keyboardHandlers.onStart(kbEvent(0));
      keyboardHandlers.onEnd(kbEvent(0));
      mockOffset.value = 0;

      // ---- Second focus (NO selection event — Android behavior) ----
      mockScrollTo.mockClear();

      keyboardHandlers.onStart(kbEvent(KEYBOARD_HEIGHT));
      // No selectionHandler call — Android doesn't re-emit for same cursor
      keyboardHandlers.onMove(kbEvent(KEYBOARD_HEIGHT));

      // Must use stale selection (height=123), NOT full input height (360)
      // With full input: point = 541+360 = 901, scroll = 348 (WRONG)
      // With stale selection: point = 541+123 = 664, scroll = 111 (CORRECT)
      expect(lastScrollToY()).toBeCloseTo(111, 0);

      keyboardHandlers.onEnd(kbEvent(KEYBOARD_HEIGHT));
    });
  });
});
