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

describe("`useChatKeyboard` — Android behaviors", () => {
  it("persistent inverted: should always reset padding on close", () => {
    mockOffset.value = 500;
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    handlers.onEnd({ height: 0 });

    expect(result.current.padding.value).toBe(0);
  });

  it("persistent inverted: should not decrease shift when NOT at end", () => {
    mockOffset.value = 500;
    render({
      inverted: true,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    expect(mockScrollTo).toHaveBeenCalled();
    mockScrollTo.mockClear();

    // currentShift = offsetBeforeScroll(500) + padding(300) - scroll(500) = 300
    // effective = 200 < 300 → return (not at end, so persistent holds)
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("persistent inverted: should scrollTo on close when at end", () => {
    mockOffset.value = 0;
    render({
      inverted: true,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // Simulate keyboard closing
    handlers.onStart({ height: 0 });
    // currentShift = 0 + 300 - 0 = 300, effective = 200 < 300
    // but at end → scrollTo called with snap to end
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).toHaveBeenCalled();
  });

  it("persistent non-inverted: should scroll back on close when at end", () => {
    // Position at end: offset + layout >= content - threshold → 1200 + 800 >= 2000 - 20
    mockOffset.value = 1200;
    render({ inverted: false, keyboardLiftBehavior: "persistent" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // Simulate keyboard closing (re-capture in onStart)
    // offsetBeforeScroll = scroll(1200) - padding(300) = 900
    // But wasAtEnd check uses offsetBeforeScroll + padding = 900 + 300 = 1200
    // isScrollAtEnd(1200, 800, 2000) = 1200 + 800 >= 1980 → true
    mockOffset.value = 1500;
    handlers.onStart({ height: 0 });
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).toHaveBeenCalled();
  });

  it("never non-inverted: should not scroll", () => {
    mockOffset.value = 100;
    render({ inverted: false, keyboardLiftBehavior: "never" });

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
