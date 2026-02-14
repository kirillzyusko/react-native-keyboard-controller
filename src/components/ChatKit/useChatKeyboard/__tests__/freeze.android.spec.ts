import { renderHook } from "@testing-library/react-native";
import { Platform } from "react-native";
import { useAnimatedRef } from "react-native-reanimated";

import type { useChatKeyboard } from "..";
import type Reanimated from "react-native-reanimated";

type KeyboardEvent = { height: number };
type Handlers = {
  onStart?: (e: KeyboardEvent) => void;
  onMove?: (e: KeyboardEvent) => void;
  onEnd?: (e: KeyboardEvent) => void;
};

let handlers: Handlers = {};

jest.mock("../../../../hooks", () => ({
  useKeyboardHandler: jest.fn((h: Handlers) => {
    handlers = h;
  }),
  useResizeMode: jest.fn(),
}));

const mockOffset = { value: 0 };
const mockLayout = { value: { width: 390, height: 800 } };
const mockSize = { value: { width: 390, height: 2000 } };

jest.mock("../../../hooks/useScrollState", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    offset: mockOffset,
    layout: mockLayout,
    size: mockSize,
  })),
}));

const KEYBOARD = 300;
const mockScrollTo = jest.fn();

/** Reset mock scroll state to defaults. */
function reset() {
  mockOffset.value = 0;
  mockLayout.value = { width: 390, height: 800 };
  mockSize.value = { width: 390, height: 2000 };
}

/**
 * Render the hook with Platform.OS = "android" and freeze enabled.
 *
 * @param options - Hook configuration.
 * @returns renderHook result.
 */
function render(
  options: Omit<Parameters<typeof useChatKeyboard>[1], "freeze"> & {
    freeze?: boolean;
  },
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("..") as { useChatKeyboard: typeof useChatKeyboard };

  return renderHook(() => {
    const ref = useAnimatedRef<Reanimated.ScrollView>();

    return mod.useChatKeyboard(ref, {
      ...options,
      freeze: options.freeze ?? true,
    });
  });
}

beforeEach(() => {
  jest.resetModules();
  Object.defineProperty(Platform, "OS", { value: "android" });

  jest.doMock("react-native-reanimated", () => ({
    ...require("react-native-reanimated/mock"),
    scrollTo: mockScrollTo,
  }));

  reset();
  mockScrollTo.mockClear();
});

afterAll(() => {
  Object.defineProperty(Platform, "OS", { value: "ios" });
});

describe("`useChatKeyboard` — Android freeze", () => {
  it("should not call scrollTo on keyboard open", () => {
    mockOffset.value = 100;
    render({
      inverted: false,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: KEYBOARD });
    handlers.onMove!({ height: 200 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should not change containerTranslateY on keyboard open", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: KEYBOARD });
    handlers.onMove!({ height: 200 });

    expect(result.current.containerTranslateY.value).toBe(0);
  });

  it("should not change padding in onEnd", () => {
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
    });

    handlers.onEnd!({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(0);
  });
});
