import {
  type Handlers,
  KEYBOARD,
  createRender,
  mockLayout,
  mockOffset,
  mockScrollTo,
  mockSize,
  setupBeforeEach,
} from "../__fixtures__/testUtils";

const render = createRender("../index.ts");

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
});

describe("`useChatKeyboard` — Android closing behaviors", () => {
  // --- whenAtEnd non-inverted ---

  it("whenAtEnd non-inverted: should NOT scroll on close when open didn't shift", () => {
    // Not at end: 100 + 800 < 2000 - 20
    mockOffset.value = 100;
    render({ inverted: false, keyboardLiftBehavior: "whenAtEnd" });

    // Keyboard opens — sentinel set to -1 (not at end)
    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).not.toHaveBeenCalled();

    // Keyboard closes — sentinel preserved, still no scroll
    handlers.onStart({ height: 0 });
    handlers.onMove({ height: 100 });
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("whenAtEnd non-inverted: should scroll back on close when open DID shift", () => {
    // At end: 1200 + 800 >= 2000 - 20
    mockOffset.value = 1200;
    render({ inverted: false, keyboardLiftBehavior: "whenAtEnd" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // User at pushed position
    mockOffset.value = 1500;
    handlers.onStart({ height: 0 });
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).toHaveBeenCalled();
  });

  // --- never non-inverted ---

  it("never non-inverted: should not scroll on open even when at end", () => {
    // At end: 1200 + 800 >= 2000 - 20
    mockOffset.value = 1200;
    render({ inverted: false, keyboardLiftBehavior: "never" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("never non-inverted: should scroll back on close when at end", () => {
    mockOffset.value = 1200;
    render({ inverted: false, keyboardLiftBehavior: "never" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    expect(mockScrollTo).not.toHaveBeenCalled();

    // Keyboard closes: offsetBeforeScroll = 1200 - 300 = 900
    handlers.onStart({ height: 0 });
    handlers.onMove({ height: 200 });
    // wasAtEnd: isScrollAtEnd(900+300, 800, 2000) = 2000 >= 1980 → true
    // target = clampedScrollTarget(900, 200, 2000, 800) = min(1100, 1400) = 1100
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      1100,
      false,
    );
  });

  // --- persistent non-inverted ---

  it("persistent non-inverted: should maintain position on close (keepAt within range)", () => {
    mockOffset.value = 100;
    render({ inverted: false, keyboardLiftBehavior: "persistent" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // User at pushed position = 400
    mockOffset.value = 400;
    handlers.onStart({ height: 0 }); // offsetBeforeScroll = 400 - 300 = 100
    handlers.onMove({ height: 200 });
    // keepAt = 100 + 300 = 400, maxScroll = 2000 - 800 + 200 = 1400
    // target = min(400, 1400) = 400
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      400,
      false,
    );
  });

  it("persistent non-inverted: should clamp to max when position exceeds valid range", () => {
    // Small content so position exceeds natural max scroll
    mockSize.value = { width: 390, height: 1000 };
    mockOffset.value = 100;
    render({ inverted: false, keyboardLiftBehavior: "persistent" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    mockOffset.value = 400;
    handlers.onStart({ height: 0 }); // offsetBeforeScroll = 400 - 300 = 100
    handlers.onMove({ height: 0 });
    // keepAt = 100 + 300 = 400, maxScroll = 1000 - 800 + 0 = 200
    // target = min(400, 200) = 200
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      200,
      false,
    );
  });

  // --- inverted closing gap fixes ---

  it("whenAtEnd inverted: should reduce padding on close when not at end", () => {
    mockOffset.value = 100; // not at end for inverted (end is near 0)
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "whenAtEnd",
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    expect(mockScrollTo).not.toHaveBeenCalled();

    // Close keyboard
    handlers.onStart({ height: 0 });
    handlers.onMove({ height: 200 });
    // shouldShiftContent("whenAtEnd", false) → false
    // closing && effective(200) < padding(300) → padding reduced
    expect(result.current.padding.value).toBe(200);
  });

  it("never inverted: should reduce padding on close when not at end", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "never",
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });

    handlers.onStart({ height: 0 });
    handlers.onMove({ height: 200 });
    expect(result.current.padding.value).toBe(200);
  });

  it("persistent inverted: should reduce padding on close when not at end", () => {
    mockOffset.value = 500;
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    handlers.onStart({ height: 0 });
    handlers.onMove({ height: 200 });
    // persistent block: effective(200) < currentShift(300), !wasAtEnd, closing → true
    expect(result.current.padding.value).toBe(200);
  });
});
