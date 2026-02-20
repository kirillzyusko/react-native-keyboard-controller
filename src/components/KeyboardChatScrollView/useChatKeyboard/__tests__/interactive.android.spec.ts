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

describe("`useChatKeyboard` — Android interactive dismissal (inverted)", () => {
  it("should lock scroll and update containerTranslateY on first interactive", () => {
    mockOffset.value = 50;
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    // keyboard opens
    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // interactive dismiss begins
    handlers.onStart({ height: 0 });
    handlers.onInteractive({ height: 200 });

    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 50, false);
    expect(result.current.containerTranslateY.value).toBe(-200);
  });

  it("should maintain scroll lock across multiple interactive frames", () => {
    mockOffset.value = 50;
    render({ inverted: true, keyboardLiftBehavior: "always" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    handlers.onStart({ height: 0 });
    handlers.onInteractive({ height: 250 });

    // simulate scroll view drifting due to touch
    mockOffset.value = 80;
    handlers.onInteractive({ height: 200 });

    // should still lock at original position (50), not the drifted one
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      50,
      false,
    );
  });

  it("should unlock scroll when keyboard stays at full height", () => {
    mockOffset.value = 50;
    render({ inverted: true, keyboardLiftBehavior: "always" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // interactive dismiss begins and then reverses back to full height
    handlers.onStart({ height: 0 });
    handlers.onInteractive({ height: 250 });
    handlers.onInteractive({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // keyboard stays at full height for consecutive frames → unlock
    handlers.onInteractive({ height: KEYBOARD });
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should re-lock when keyboard starts closing from full height", () => {
    mockOffset.value = 50;
    render({ inverted: true, keyboardLiftBehavior: "always" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });

    // interactive: dismiss → return to full → unlock → dismiss again
    handlers.onStart({ height: 0 });
    handlers.onInteractive({ height: 250 });
    handlers.onInteractive({ height: KEYBOARD });
    handlers.onInteractive({ height: KEYBOARD }); // unlock

    // user scrolled while unlocked
    mockOffset.value = 120;
    mockScrollTo.mockClear();

    // keyboard starts closing again → re-lock at current position (120)
    handlers.onInteractive({ height: 280 });
    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 120, false);
  });

  it("should unlock scroll when keyboard stays at zero", () => {
    mockOffset.value = 50;
    render({ inverted: true, keyboardLiftBehavior: "always" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // interactive dismiss to zero
    handlers.onStart({ height: 0 });
    handlers.onInteractive({ height: 100 });
    handlers.onInteractive({ height: 0 });
    mockScrollTo.mockClear();

    // keyboard stays at zero → unlock
    handlers.onInteractive({ height: 0 });
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should re-lock when keyboard starts revealing from zero", () => {
    mockOffset.value = 50;
    render({ inverted: true, keyboardLiftBehavior: "always" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });

    // interactive dismiss to zero, unlock, then reveal
    handlers.onStart({ height: 0 });
    handlers.onInteractive({ height: 100 });
    handlers.onInteractive({ height: 0 });
    handlers.onInteractive({ height: 0 }); // unlock

    mockOffset.value = 90;
    mockScrollTo.mockClear();

    // keyboard starts revealing → re-lock at current position (90)
    handlers.onInteractive({ height: 20 });
    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 90, false);
  });

  it("should reset lock state in onEnd", () => {
    mockOffset.value = 50;
    render({ inverted: true, keyboardLiftBehavior: "always" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });

    // interactive session
    handlers.onStart({ height: 0 });
    handlers.onInteractive({ height: 200 });
    handlers.onEnd({ height: 0 });

    // new interactive session should re-save at new position
    mockOffset.value = 200;
    mockScrollTo.mockClear();

    handlers.onStart({ height: KEYBOARD });
    handlers.onStart({ height: 0 });
    handlers.onInteractive({ height: 250 });

    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 200, false);
  });

  it("freeze: should not respond to interactive events", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
      freeze: true,
    });

    handlers.onInteractive({ height: 200 });

    expect(mockScrollTo).not.toHaveBeenCalled();
    expect(result.current.containerTranslateY.value).toBe(0);
  });
});
