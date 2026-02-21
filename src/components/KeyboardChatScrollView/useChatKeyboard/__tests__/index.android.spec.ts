import { Platform } from "react-native";

import {
  type Handlers,
  KEYBOARD,
  mockLayout,
  mockOffset,
  mockScrollTo,
  mockSize,
  render,
  setupBeforeEach,
} from "../__fixtures__/testUtils";

let handlers: Handlers = {
  onStart: jest.fn(),
  onMove: jest.fn(),
  onInteractive: jest.fn(),
  onEnd: jest.fn(),
};

jest.mock("../../../../hooks", () => ({
  useKeyboardHandler: jest.fn((h: Handlers) => {
    handlers = h;
  }),
  useResizeMode: jest.fn(),
}));

jest.mock("../../../hooks/useScrollState", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    offset: mockOffset,
    layout: mockLayout,
    size: mockSize,
  })),
}));

beforeEach(() => {
  setupBeforeEach();
  Object.defineProperty(Platform, "OS", { value: "android" });
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

    handlers.onStart({ height: KEYBOARD });
    expect(result.current.padding.value).toBe(KEYBOARD);

    handlers.onMove({ height: 200 });
    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 300, false);
  });

  it("should call scrollTo with growing values per-frame", () => {
    mockOffset.value = 100;
    render({ inverted: false, keyboardLiftBehavior: "always" });

    handlers.onStart({ height: KEYBOARD });

    handlers.onMove({ height: 150 });
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      250,
      false,
    );

    handlers.onMove({ height: KEYBOARD });
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
    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // user scrolls up to 200 while keyboard is open
    mockOffset.value = 200;

    // keyboard starts closing: re-captures offsetBeforeScroll = 200 - 300 = -100
    handlers.onStart({ height: 0 });

    // dismiss frame: target = clamp(-100 + 150, 0, ...) = 50
    handlers.onMove({ height: 150 });
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      50,
      false,
    );

    // final frame: target = clamp(-100 + 0, 0, ...) = 0
    handlers.onMove({ height: 0 });
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

    handlers.onStart({ height: KEYBOARD });
    // user did NOT scroll — offset stays at what scrollTo set (100 + 300 = 400)
    mockOffset.value = 400;
    mockScrollTo.mockClear();

    // keyboard closes: re-captures offsetBeforeScroll = 400 - 300 = 100 (same as original)
    handlers.onStart({ height: 0 });

    handlers.onMove({ height: 150 });
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

    handlers.onStart({ height: KEYBOARD });
    handlers.onEnd({ height: KEYBOARD });
    expect(result.current.padding.value).toBe(KEYBOARD);

    handlers.onEnd({ height: 0 });
    expect(result.current.padding.value).toBe(0);
  });
});

describe("`useChatKeyboard` — Android inverted + always", () => {
  it("should set padding in onStart and call scrollTo in onMove", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart({ height: KEYBOARD });
    expect(result.current.padding.value).toBe(KEYBOARD);

    handlers.onMove({ height: 200 });
    // target = offsetBeforeScroll(0) + padding(300) - effective(200) = 100
    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 100, false);
  });

  it("should call scrollTo per-frame with correct targets", () => {
    render({ inverted: true, keyboardLiftBehavior: "always" });

    handlers.onStart({ height: KEYBOARD });

    handlers.onMove({ height: 100 });
    // target = 0 + 300 - 100 = 200
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      200,
      false,
    );

    handlers.onMove({ height: 250 });
    // target = 0 + 300 - 250 = 50
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      50,
      false,
    );
  });

  it("should return undefined for contentOffsetY", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    expect(result.current.contentOffsetY).toBeUndefined();
  });

  it("should scroll back on keyboard close", () => {
    render({ inverted: true, keyboardLiftBehavior: "always" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // keyboard closes: offsetBeforeScroll = scroll.value = 0
    handlers.onStart({ height: 0 });

    handlers.onMove({ height: 150 });
    // target = 0 + 300 - 150 = 150
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      150,
      false,
    );

    handlers.onMove({ height: 0 });
    // target = 0 + 300 - 0 = 300
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      300,
      false,
    );
  });

  it("should preserve user scroll position on close", () => {
    render({ inverted: true, keyboardLiftBehavior: "always" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // user scrolled to 50 while keyboard open
    mockOffset.value = 50;
    handlers.onStart({ height: 0 });

    handlers.onMove({ height: 150 });
    // target = 50 + 300 - 150 = 200
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      200,
      false,
    );
  });

  it("should finalize padding in onEnd", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onEnd({ height: KEYBOARD });
    expect(result.current.padding.value).toBe(KEYBOARD);

    handlers.onEnd({ height: 0 });
    expect(result.current.padding.value).toBe(0);
  });
});
