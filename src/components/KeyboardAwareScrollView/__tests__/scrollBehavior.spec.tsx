import React from "react";
import { View } from "react-native";
import { render, act } from "@testing-library/react-native";

// ---------------------------------------------------------------------------
// Constants (derived from real device logs)
// ---------------------------------------------------------------------------
const SCREEN_HEIGHT = 928;
const KEYBOARD_HEIGHT = 312;
const BOTTOM_OFFSET = 62;
const SV_TARGET = 1469; // scrollView native handle
const INPUT_TARGET_A = 1373; // first TextInput native handle
const INPUT_TARGET_B = 1395; // second TextInput native handle

const INPUT_LAYOUT_A = {
  absoluteY: 281.67,
  height: 60.33,
  y: 165.67,
  x: 0,
  absoluteX: 16,
  width: 394.67,
};

const INPUT_LAYOUT_B = {
  absoluteY: 695.67,
  height: 60.33,
  y: 579.67,
  x: 0,
  absoluteX: 16,
  width: 121,
};

// ---------------------------------------------------------------------------
// Mocks – state
// ---------------------------------------------------------------------------
const mockScrollTo = jest.fn();
const mockInput: { value: any } = { value: null };
const mockOffset: { value: number } = { value: 0 };
const mockLayout: { value: { width: number; height: number } } = {
  value: { width: 390, height: 812 },
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

function inputEvent(
  target: number,
  layout: typeof INPUT_LAYOUT_A,
) {
  return {
    target,
    parentScrollViewTarget: SV_TARGET,
    layout: { ...layout },
  };
}

function selectionEvent(
  target: number,
  endY = 47,
  endPosition = 0,
) {
  return {
    target,
    selection: {
      start: { x: 0, y: endY, position: endPosition },
      end: { x: 0, y: endY, position: endPosition },
    },
  };
}

function kbEvent(height: number, target: number) {
  return {
    height,
    target,
    duration: height > 0 ? 285 : 285,
    progress: KEYBOARD_HEIGHT > 0 ? height / KEYBOARD_HEIGHT : 0,
  };
}

function resetMocks() {
  mockScrollTo.mockClear();
  mockOffset.value = 0;
  mockLayout.value = { width: 390, height: 812 };
  mockSize.value = { width: 390, height: 2000 };
  mockInput.value = null;
  capturedOnLayout = null;
}

async function renderKASV(bottomOffset = BOTTOM_OFFSET) {
  const KeyboardAwareScrollView = require("../index").default;

  render(
    <KeyboardAwareScrollView bottomOffset={bottomOffset}>
      <View />
    </KeyboardAwareScrollView>,
  );

  await act(async () => {
    capturedOnLayout?.({
      nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 812 } },
    });
  });
}

function lastScrollToY(): number | undefined {
  const calls = mockScrollTo.mock.calls;

  if (calls.length === 0) {
    return undefined;
  }

  return calls[calls.length - 1][2];
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  resetMocks();
});

describe("KeyboardAwareScrollView scroll behavior", () => {
  // First input (A) is above the keyboard — no scroll needed.
  // Second input (B) is below the keyboard — scroll IS needed.
  //
  // visibleRect = 928 - 312 = 616
  //
  // Input A: point = 281.67 + 47 = 328.67
  //   visibleRect - point = 287.33 > bottomOffset(62) → NO scroll
  //
  // Input B: point = 695.67 + 47 = 742.67
  //   visibleRect - point = -126.67 <= bottomOffset(62) → SCROLL
  //   relativeScrollTo = 312 - (928 - 742.67) + 62 = 188.67
  //   targetScrollY = 188.67 + scrollPosition

  describe("iOS 16+: onSelectionChange → onStart → onMove → onEnd", () => {
    it("should not scroll when input is already visible", async () => {
      await renderKASV();
      mockInput.value = inputEvent(INPUT_TARGET_A, INPUT_LAYOUT_A);

      selectionHandler(selectionEvent(INPUT_TARGET_A));
      keyboardHandlers.onStart(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A));

      mockScrollTo.mockClear();
      keyboardHandlers.onMove(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A));

      // Input A is visible — no scroll needed
      expect(mockScrollTo).not.toHaveBeenCalled();

      keyboardHandlers.onEnd(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A));
    });
  });

  describe("iOS 15: onStart → onSelectionChange → onMove → onEnd", () => {
    it("should use deferred selection and scroll correctly", async () => {
      await renderKASV();
      mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);

      keyboardHandlers.onStart(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
      selectionHandler(selectionEvent(INPUT_TARGET_B));

      mockScrollTo.mockClear();
      keyboardHandlers.onMove(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));

      // Must use selection height (47), not full input (60.33)
      expect(lastScrollToY()).toBeCloseTo(188.67, 0);

      keyboardHandlers.onEnd(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
    });
  });

  describe("iOS 15: refocus same input after keyboard hide", () => {
    it("should use fresh selection data on refocus", async () => {
      await renderKASV();
      mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);

      // ---- First focus (cursor at y=47) ----
      keyboardHandlers.onStart(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
      selectionHandler(selectionEvent(INPUT_TARGET_B, 47, 0));
      keyboardHandlers.onMove(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
      keyboardHandlers.onEnd(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
      mockOffset.value = 189;

      // ---- Keyboard hide ----
      keyboardHandlers.onStart(kbEvent(0, INPUT_TARGET_B));
      keyboardHandlers.onEnd(kbEvent(0, INPUT_TARGET_B));
      mockOffset.value = 0;

      // ---- Second focus (cursor at y=20 — different position) ----
      mockScrollTo.mockClear();

      keyboardHandlers.onStart(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
      selectionHandler(selectionEvent(INPUT_TARGET_B, 20, 5));
      keyboardHandlers.onMove(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));

      // point = 695.67 + 20 = 715.67
      // relativeScrollTo = 312 - (928 - 715.67) + 62 = 161.67
      expect(lastScrollToY()).toBeCloseTo(161.67, 0);

      keyboardHandlers.onEnd(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
    });
  });

  describe("Android: refocus same input, selection not re-emitted", () => {
    it("should use stale selection as fallback when no new selection arrives", async () => {
      await renderKASV();
      mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);

      // ---- First focus (selection arrives) ----
      selectionHandler(selectionEvent(INPUT_TARGET_B, 47, 0));
      keyboardHandlers.onStart(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
      keyboardHandlers.onMove(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
      keyboardHandlers.onEnd(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
      mockOffset.value = 189;

      // ---- Keyboard hide ----
      keyboardHandlers.onStart(kbEvent(0, INPUT_TARGET_B));
      keyboardHandlers.onEnd(kbEvent(0, INPUT_TARGET_B));
      mockOffset.value = 0;

      // ---- Second focus (NO selection event — Android behavior) ----
      mockScrollTo.mockClear();

      keyboardHandlers.onStart(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
      keyboardHandlers.onMove(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));

      // Must use stale selection (height=47), NOT full input height (60.33)
      expect(lastScrollToY()).toBeCloseTo(188.67, 0);

      keyboardHandlers.onEnd(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
    });
  });

  describe("Toolbar: focus switch while keyboard is visible", () => {
    it("should scroll to newly focused input via deferred selection", async () => {
      await renderKASV();
      mockInput.value = inputEvent(INPUT_TARGET_A, INPUT_LAYOUT_A);

      // ---- Focus input A — keyboard opens, no scroll needed ----
      selectionHandler(selectionEvent(INPUT_TARGET_A));
      keyboardHandlers.onStart(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A));
      keyboardHandlers.onMove(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A));
      keyboardHandlers.onEnd(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A));

      // ---- Toolbar moves focus to input B (keyboard stays visible) ----
      // Native sends onStart → onEnd (no animation, duration=0)
      // then onSelectionChange arrives
      mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);
      mockScrollTo.mockClear();

      keyboardHandlers.onStart(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
      keyboardHandlers.onEnd(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));

      // Selection arrives AFTER onEnd — the pendingSelectionForFocus flag
      // must survive onEnd so the deferred scroll runs here
      selectionHandler(selectionEvent(INPUT_TARGET_B, 47, 0));

      // point = 695.67 + 47 = 742.67
      // relativeScrollTo = 312 - (928 - 742.67) + 62 = 188.67
      expect(lastScrollToY()).toBeCloseTo(188.67, 0);
    });
  });
});
