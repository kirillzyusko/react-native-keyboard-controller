import { Platform } from "react-native";

import {
  type Handlers,
  KEYBOARD,
  mockOffset,
  mockScrollTo,
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
    layout: { value: { width: 390, height: 800 } },
    size: { value: { width: 390, height: 2000 } },
  })),
}));

beforeEach(() => {
  setupBeforeEach();
  Object.defineProperty(Platform, "OS", { value: "android" });
});

afterAll(() => {
  Object.defineProperty(Platform, "OS", { value: "ios" });
});

describe("`useChatKeyboard` — Android post-interactive snap-back (inverted)", () => {
  it("should skip snap-back (duration=-1) in onStart", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    // snap-back event without prior open → padding stays 0
    handlers.onStart({ height: KEYBOARD, duration: -1 });
    expect(result.current.padding.value).toBe(0);
  });

  it("should skip snap-back (duration=-1) in onMove", () => {
    render({ inverted: true, keyboardLiftBehavior: "always" });

    // Normal keyboard open
    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // User scrolls while keyboard is open
    mockOffset.value = 100;

    // Post-interactive snap-back events — should be entirely skipped
    handlers.onStart({ height: KEYBOARD, duration: -1 });
    handlers.onMove({ height: 200, duration: -1 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should not skip normal events with duration !== -1", () => {
    render({ inverted: true, keyboardLiftBehavior: "always" });

    handlers.onStart({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // Normal onMove (no duration or duration > 0)
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).toHaveBeenCalled();
  });
});
