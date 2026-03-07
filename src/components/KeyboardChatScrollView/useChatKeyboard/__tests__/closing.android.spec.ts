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

    // Open — never mode: no scroll
    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    expect(mockScrollTo).not.toHaveBeenCalled();

    // User scrolled to max valid position during keyboard open
    // (maxScroll with padding=300 is 2000-800+300=1500)
    mockOffset.value = 1500;
    handlers.onStart({ height: 0 });
    // Keyboard partially closed: effective=200, actualTotalPadding=max(0,200)=200
    // maxScroll = 2000-800+200 = 1400, scroll=1500 > 1400 → clamp
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      1400,
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

  it("never inverted: should scroll to 0 on close when WAS at end", () => {
    // At end for inverted means offset near 0
    mockOffset.value = 0;
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "never",
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });

    // Keyboard closes — offsetBeforeScroll re-captured as current scroll (0)
    handlers.onStart({ height: 0 });
    // effective=200 < padding=300, wasAtEnd=isScrollAtEnd(0, 800, 2000, true)=true
    handlers.onMove({ height: 200 });

    expect(result.current.padding.value).toBe(200);
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      0,
      false,
    );
  });

  it("never non-inverted: should clamp position on close when NOT at end", () => {
    // Not at end: 100 + 800 = 900 < 2000 - 20
    mockOffset.value = 100;
    render({ inverted: false, keyboardLiftBehavior: "never" });

    handlers.onStart({ height: KEYBOARD });

    // Keyboard closes; offsetBeforeScroll = 100 - 300 = -200
    handlers.onStart({ height: 0 });
    // effective=200 < padding=300, wasAtEnd=isScrollAtEnd(-200+300=100, 800, 2000)=false
    // → else branch → clampScrollIfNeeded(200); scroll=100 < maxScroll=1400 → no scrollTo
    handlers.onMove({ height: 200 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("whenAtEnd inverted: should clamp scroll to maxScroll on close when position exceeds new range", () => {
    // Small content so that old scroll (900) exceeds maxScroll after keyboard shrinks
    mockSize.value = { width: 390, height: 1500 };
    // Not at end: isScrollAtEnd(900, 800, 1500, true) = (900 <= 20) = false
    mockOffset.value = 900;
    render({ inverted: true, keyboardLiftBehavior: "whenAtEnd" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // Keyboard closes — offsetBeforeScroll re-captured as 900
    handlers.onStart({ height: 0 });
    // effective=50 < padding=300, !shouldShift(whenAtEnd, false)=true
    // closing && 50<300 → clampScrollIfNeeded(50)
    // maxScroll = 1500-800+50 = 750; scroll(900) > 750 → scrollTo(750)
    handlers.onMove({ height: 50 });

    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      750,
      false,
    );
  });
});
