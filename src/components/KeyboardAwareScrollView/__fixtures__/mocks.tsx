/**
 * Shared `jest.mock()` registrations for KeyboardAwareScrollView tests.
 *
 * Import this file in each test file. Because `jest.mock()` calls are hoisted
 * by babel, they will always run before any other imports.
 *
 * @example import "../__fixtures__/mocks";
 */

// ---------------------------------------------------------------------------
// Inline constants & helpers — defined here to avoid a circular dependency
// chain (testUtils → useChatKeyboard/testUtils → reanimated → this factory).
// ---------------------------------------------------------------------------
const MOCK_SCREEN_H = 928;
const MOCK_SV = 1469;

const mockInterpolateFn = (
  value: number,
  input: number[],
  output: number[],
): number => {
  "worklet";

  if (input[1] === 0) {
    return 0;
  }

  const progress = (value - input[0]) / (input[1] - input[0]);

  return output[0] + progress * (output[1] - output[0]);
};

const mockState = () => require("./testUtils");

// ---------------------------------------------------------------------------
// jest.mock registrations
// ---------------------------------------------------------------------------

jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  scrollTo: (...args: unknown[]) => mockState().mockScrollTo(...args),
  interpolate: mockInterpolateFn,
  clamp: (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max),
}));

jest.mock("../useSmoothKeyboardHandler", () => ({
  useSmoothKeyboardHandler: jest.fn(
    (h: {
      onStart: (e: unknown) => void;
      onMove: (e: unknown) => void;
      onEnd: (e: unknown) => void;
    }) => {
      mockState().mockKeyboardHandlers.current = h;
    },
  ),
}));

jest.mock("../../../hooks", () => ({
  useFocusedInputHandler: jest.fn(
    (h: { onSelectionChange: (...args: unknown[]) => void }) => {
      mockState().mockSelectionHandler.current = h.onSelectionChange;
    },
  ),
  useReanimatedFocusedInput: jest.fn(() => ({
    input: mockState().mockInput,
    update: jest.fn().mockResolvedValue(undefined),
  })),
  useWindowDimensions: jest.fn(() => ({ height: MOCK_SCREEN_H })),
}));

jest.mock("../../hooks/useScrollState", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    offset: mockState().mockOffset,
    layout: mockState().mockLayout,
    size: mockState().mockSize,
  })),
}));

jest.mock("../../hooks/useCombinedRef", () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
}));

jest.mock("../../../utils/findNodeHandle", () => ({
  findNodeHandle: jest.fn(() => MOCK_SV),
}));

jest.mock("../../../bindings", () => ({
  KeyboardControllerNative: {
    viewPositionInWindow: jest.fn().mockResolvedValue({ y: 0 }),
  },
}));

jest.mock("../../ScrollViewWithBottomPadding", () => {
  const { forwardRef, createElement } = require("react");
  const { View: MockView } = require("react-native");

  return {
    __esModule: true,
    default: forwardRef(
      (
        props: { onLayout?: (e: never) => void; children?: unknown },
        ref: unknown,
      ) => {
        mockState().mockCapturedOnLayout.current = props.onLayout ?? null;

        return createElement(MockView, { ref }, props.children);
      },
    ),
  };
});
