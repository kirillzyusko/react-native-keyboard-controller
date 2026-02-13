import { renderHook } from "@testing-library/react-native";
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
 * Render the hook with Platform.OS = "ios" (via jest.resetModules).
 *
 * @param options - Hook configuration.
 * @returns renderHook result.
 */
function render(options: Parameters<typeof useChatKeyboard>[1]) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("..") as { useChatKeyboard: typeof useChatKeyboard };

  return renderHook(() => {
    const ref = useAnimatedRef<Reanimated.ScrollView>();

    return mod.useChatKeyboard(ref, options);
  });
}

beforeEach(() => {
  jest.resetModules();

  // Inject trackable scrollTo into the fresh reanimated module
  jest.doMock("react-native-reanimated", () => ({
    ...jest.requireActual("react-native-reanimated/mock"),
    scrollTo: mockScrollTo,
  }));

  reset();
  mockScrollTo.mockClear();
});

describe("`useChatKeyboard` — iOS non-inverted + always", () => {
  it("should set padding and contentOffsetY on keyboard open", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(KEYBOARD);
    expect(result.current.contentOffsetY!.value).toBe(400);
  });

  it("should restore contentOffsetY on keyboard close", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: KEYBOARD });
    mockOffset.value = 400;
    handlers.onStart!({ height: 0 });

    expect(result.current.padding.value).toBe(0);
    expect(result.current.contentOffsetY!.value).toBe(100);
  });

  it("should handle keyboard resize (emoji toggle)", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: 300 });
    mockOffset.value = 400;
    handlers.onStart!({ height: 350 });

    expect(result.current.padding.value).toBe(350);
    expect(result.current.contentOffsetY!.value).toBe(450);
  });

  it("should clamp contentOffsetY when content is short", () => {
    mockSize.value = { width: 390, height: 500 };
    mockOffset.value = 0;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: KEYBOARD });

    expect(result.current.contentOffsetY!.value).toBe(0);
  });

  it("should not call scrollTo on iOS", () => {
    render({ inverted: false, keyboardLiftBehavior: "always" });

    handlers.onStart!({ height: KEYBOARD });
    handlers.onMove!({ height: 150 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});

describe("`useChatKeyboard` — iOS inverted + always", () => {
  it("should set inverted contentOffsetY on keyboard open", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: KEYBOARD });

    expect(result.current.contentOffsetY!.value).toBe(-KEYBOARD);
  });

  it("should restore contentOffsetY on keyboard close", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: KEYBOARD });
    mockOffset.value = -300;
    handlers.onStart!({ height: 0 });

    expect(result.current.contentOffsetY!.value).toBe(0);
  });

  it("should account for user scrolling while keyboard open", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: KEYBOARD });
    mockOffset.value = -250;
    handlers.onStart!({ height: 0 });

    expect(result.current.contentOffsetY!.value).toBe(50);
  });

  it("should handle keyboard resize (inverted)", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart!({ height: 300 });
    mockOffset.value = -300;
    handlers.onStart!({ height: 350 });

    expect(result.current.contentOffsetY!.value).toBe(-350);
  });
});

describe("`useChatKeyboard` — iOS behaviors", () => {
  it("never: should set padding but not shift content", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "never",
    });

    handlers.onStart!({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(KEYBOARD);
    expect(result.current.contentOffsetY!.value).toBe(0);
  });

  it("whenAtEnd: should shift when at the end", () => {
    mockOffset.value = 1180;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "whenAtEnd",
    });

    handlers.onStart!({ height: KEYBOARD });

    expect(result.current.contentOffsetY!.value).toBe(1480);
  });

  it("whenAtEnd: should NOT shift when far from the end", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "whenAtEnd",
    });

    handlers.onStart!({ height: KEYBOARD });

    expect(result.current.contentOffsetY!.value).toBe(0);
  });

  it("onEnd: should finalize padding", () => {
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
    });

    handlers.onEnd!({ height: KEYBOARD });
    expect(result.current.padding.value).toBe(KEYBOARD);

    handlers.onEnd!({ height: 0 });
    expect(result.current.padding.value).toBe(0);
  });
});
