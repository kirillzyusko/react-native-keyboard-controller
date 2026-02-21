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

describe("`useChatKeyboard` — Android behaviors", () => {
  it("persistent inverted: should NOT reset padding on close", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    handlers.onEnd({ height: 0 });

    expect(result.current.padding.value).toBe(KEYBOARD);
  });

  it("persistent inverted: should not decrease shift", () => {
    render({
      inverted: true,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    expect(mockScrollTo).toHaveBeenCalled();
    mockScrollTo.mockClear();

    // currentShift = offsetBeforeScroll(0) + padding(300) - scroll(0) = 300
    // effective = 200 < 300 → return
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("never non-inverted: should not scroll", () => {
    mockOffset.value = 100;
    render({ inverted: false, keyboardLiftBehavior: "never" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 200 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("never inverted: should not scroll", () => {
    render({ inverted: true, keyboardLiftBehavior: "never" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 200 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("whenAtEnd non-inverted: should scroll when at end", () => {
    mockOffset.value = 1180;
    render({ inverted: false, keyboardLiftBehavior: "whenAtEnd" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 200 });

    expect(mockScrollTo).toHaveBeenCalled();
  });

  it("whenAtEnd non-inverted: should NOT scroll when NOT at end", () => {
    mockOffset.value = 100;
    render({ inverted: false, keyboardLiftBehavior: "whenAtEnd" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 200 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("whenAtEnd inverted: should scroll when at end (offset near 0)", () => {
    mockOffset.value = 0;
    render({ inverted: true, keyboardLiftBehavior: "whenAtEnd" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 200 });

    expect(mockScrollTo).toHaveBeenCalled();
  });

  it("whenAtEnd inverted: should NOT scroll when scrolled away", () => {
    mockOffset.value = 500;
    render({ inverted: true, keyboardLiftBehavior: "whenAtEnd" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 200 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("persistent non-inverted: should not scroll back on shrink", () => {
    mockOffset.value = 100;
    render({ inverted: false, keyboardLiftBehavior: "persistent" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).toHaveBeenCalled();
    mockScrollTo.mockClear();

    mockOffset.value = 300;
    handlers.onMove({ height: 100 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});
