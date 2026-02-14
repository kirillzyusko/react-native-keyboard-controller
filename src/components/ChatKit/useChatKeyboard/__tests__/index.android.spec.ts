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
 * Render the hook with Platform.OS = "android" (via jest.resetModules).
 *
 * @param options - Hook configuration.
 * @returns renderHook result.
 * @example render({ inverted: false, keyboardLiftBehavior: "always" })
 */
function render(
  options: Omit<Parameters<typeof useChatKeyboard>[1], "freeze">,
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("..") as { useChatKeyboard: typeof useChatKeyboard };

  return renderHook(() => {
    const ref = useAnimatedRef<Reanimated.ScrollView>();

    return mod.useChatKeyboard(ref, { ...options, freeze: false });
  });
}

beforeEach(() => {
  jest.resetModules();
  Object.defineProperty(Platform, "OS", { value: "android" });

  // Inject trackable scrollTo into the fresh reanimated module
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

describe("`useChatKeyboard` — Android non-inverted + always", () => {
  it("should set padding in onStart and scrollTo in onMove", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: KEYBOARD });
    expect(result.current.padding.value).toBe(KEYBOARD);

    handlers.onMove!({ height: 200 });
    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 300, false);
  });

  it("should call scrollTo with growing values per-frame", () => {
    mockOffset.value = 100;
    render({ inverted: false, keyboardLiftBehavior: "always" });

    handlers.onStart!({ height: KEYBOARD });

    handlers.onMove!({ height: 150 });
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      250,
      false,
    );

    handlers.onMove!({ height: KEYBOARD });
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      400,
      false,
    );
  });

  it("should return undefined for contentOffsetY", () => {
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
    });

    expect(result.current.contentOffsetY).toBeUndefined();
  });

  it("should scroll back from current position on keyboard close", () => {
    mockOffset.value = 100;
    render({ inverted: false, keyboardLiftBehavior: "always" });

    // keyboard opens: offsetBeforeScroll = 100
    handlers.onStart!({ height: KEYBOARD });
    handlers.onMove!({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // user scrolls up to 200 while keyboard is open
    mockOffset.value = 200;

    // keyboard starts closing: re-captures offsetBeforeScroll = 200 - 300 = -100
    handlers.onStart!({ height: 0 });

    // dismiss frame: target = clamp(-100 + 150, 0, ...) = 50
    handlers.onMove!({ height: 150 });
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      50,
      false,
    );

    // final frame: target = clamp(-100 + 0, 0, ...) = 0
    handlers.onMove!({ height: 0 });
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      0,
      false,
    );
  });

  it("should not regress when user did not scroll during keyboard open", () => {
    mockOffset.value = 100;
    render({ inverted: false, keyboardLiftBehavior: "always" });

    handlers.onStart!({ height: KEYBOARD });
    // user did NOT scroll — offset stays at what scrollTo set (100 + 300 = 400)
    mockOffset.value = 400;
    mockScrollTo.mockClear();

    // keyboard closes: re-captures offsetBeforeScroll = 400 - 300 = 100 (same as original)
    handlers.onStart!({ height: 0 });

    handlers.onMove!({ height: 150 });
    // target = clamp(100 + 150, 0, ...) = 250
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      250,
      false,
    );
  });

  it("should finalize padding in onEnd", () => {
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: KEYBOARD });
    handlers.onEnd!({ height: KEYBOARD });
    expect(result.current.padding.value).toBe(KEYBOARD);

    handlers.onEnd!({ height: 0 });
    expect(result.current.padding.value).toBe(0);
  });
});

describe("`useChatKeyboard` — Android inverted + always", () => {
  it("should set containerTranslateY in onMove", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: KEYBOARD });
    handlers.onMove!({ height: 200 });

    expect(result.current.containerTranslateY.value).toBe(-200);
  });

  it("should update containerTranslateY per-frame", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: KEYBOARD });

    handlers.onMove!({ height: 100 });
    expect(result.current.containerTranslateY.value).toBe(-100);

    handlers.onMove!({ height: 250 });
    expect(result.current.containerTranslateY.value).toBe(-250);
  });

  it("should NOT call scrollTo for inverted lists", () => {
    render({ inverted: true, keyboardLiftBehavior: "always" });

    handlers.onStart!({ height: KEYBOARD });
    handlers.onMove!({ height: 200 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should reset containerTranslateY on keyboard close", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: KEYBOARD });
    handlers.onMove!({ height: KEYBOARD });
    handlers.onEnd!({ height: 0 });

    expect(result.current.containerTranslateY.value).toBe(0);
    expect(result.current.padding.value).toBe(0);
  });
});

describe("`useChatKeyboard` — Android behaviors", () => {
  it("persistent inverted: should NOT reset translateY on close", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart!({ height: KEYBOARD });
    handlers.onMove!({ height: KEYBOARD });
    handlers.onEnd!({ height: 0 });

    expect(result.current.containerTranslateY.value).toBe(-KEYBOARD);
  });

  it("persistent inverted: should not shrink translateY", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart!({ height: KEYBOARD });
    handlers.onMove!({ height: KEYBOARD });
    handlers.onMove!({ height: 200 });

    expect(result.current.containerTranslateY.value).toBe(-KEYBOARD);
  });

  it("never: should not scroll or translate", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "never",
    });

    handlers.onStart!({ height: KEYBOARD });
    handlers.onMove!({ height: 200 });

    expect(mockScrollTo).not.toHaveBeenCalled();
    expect(result.current.containerTranslateY.value).toBe(0);
  });

  it("whenAtEnd: should scroll when at end", () => {
    mockOffset.value = 1180;
    render({ inverted: false, keyboardLiftBehavior: "whenAtEnd" });

    handlers.onStart!({ height: KEYBOARD });
    handlers.onMove!({ height: 200 });

    expect(mockScrollTo).toHaveBeenCalled();
  });

  it("whenAtEnd: should NOT scroll when NOT at end", () => {
    mockOffset.value = 100;
    render({ inverted: false, keyboardLiftBehavior: "whenAtEnd" });

    handlers.onStart!({ height: KEYBOARD });
    handlers.onMove!({ height: 200 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("persistent non-inverted: should not scroll back on shrink", () => {
    mockOffset.value = 100;
    render({ inverted: false, keyboardLiftBehavior: "persistent" });

    handlers.onStart!({ height: KEYBOARD });
    handlers.onMove!({ height: 200 });
    expect(mockScrollTo).toHaveBeenCalled();
    mockScrollTo.mockClear();

    mockOffset.value = 300;
    handlers.onMove!({ height: 100 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});