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

describe("`useChatKeyboard` — iOS non-inverted + always", () => {
  it("should set padding and contentOffsetY on keyboard open", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(KEYBOARD);
    expect(result.current.contentOffsetY!.value).toBe(400);
  });

  it("should restore contentOffsetY on keyboard close", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart({ height: KEYBOARD });
    mockOffset.value = 400;
    handlers.onStart({ height: 0 });

    expect(result.current.padding.value).toBe(0);
    expect(result.current.contentOffsetY!.value).toBe(100);
  });

  it("should handle keyboard resize (emoji toggle)", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart({ height: 300 });
    mockOffset.value = 400;
    handlers.onStart({ height: 350 });

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

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.contentOffsetY!.value).toBe(0);
  });

  it("should not call scrollTo on iOS", () => {
    render({ inverted: false, keyboardLiftBehavior: "always" });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 150 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});

describe("`useChatKeyboard` — iOS inverted + always", () => {
  it("should set inverted contentOffsetY on keyboard open", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.contentOffsetY!.value).toBe(-KEYBOARD);
  });

  it("should restore contentOffsetY on keyboard close", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart({ height: KEYBOARD });
    mockOffset.value = -300;
    handlers.onStart({ height: 0 });

    expect(result.current.contentOffsetY!.value).toBe(0);
  });

  it("should account for user scrolling while keyboard open", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart({ height: KEYBOARD });
    mockOffset.value = -250;
    handlers.onStart({ height: 0 });

    expect(result.current.contentOffsetY!.value).toBe(50);
  });

  it("should handle keyboard resize (inverted)", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    handlers.onStart({ height: 300 });
    mockOffset.value = -300;
    handlers.onStart({ height: 350 });

    expect(result.current.contentOffsetY!.value).toBe(-350);
  });

  it("should clamp contentOffsetY when at max scroll on keyboard close", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
    });

    // keyboard opens
    handlers.onStart({ height: KEYBOARD });

    // user scrolls to visual top (max scroll offset)
    // maxScroll = contentHeight(2000) - layoutHeight(800) = 1200
    mockOffset.value = 1200;
    handlers.onStart({ height: 0 });

    // relativeScroll = 1200 + 300 = 1500, but maxScroll without keyboard = 1200
    // should be clamped to 1200, not 1500
    expect(result.current.contentOffsetY!.value).toBe(1200);
  });
});

describe("`useChatKeyboard` — iOS behaviors", () => {
  it("never: should set padding but not shift content", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "never",
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(KEYBOARD);
    expect(result.current.contentOffsetY!.value).toBe(0);
  });

  it("whenAtEnd: should shift when at the end", () => {
    mockOffset.value = 1180;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "whenAtEnd",
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.contentOffsetY!.value).toBe(1480);
  });

  it("whenAtEnd: should NOT shift when far from the end", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "whenAtEnd",
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.contentOffsetY!.value).toBe(0);
  });

  it("whenAtEnd + inverted: should shift when at latest messages (offset near 0)", () => {
    mockOffset.value = 0;
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "whenAtEnd",
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.contentOffsetY!.value).toBe(-KEYBOARD);
  });

  it("whenAtEnd + inverted: should NOT shift when scrolled to older messages", () => {
    mockOffset.value = 500;
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "whenAtEnd",
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.contentOffsetY!.value).toBe(0);
  });

  it("onEnd: should finalize padding", () => {
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
    });

    handlers.onEnd({ height: KEYBOARD });
    expect(result.current.padding.value).toBe(KEYBOARD);

    handlers.onEnd({ height: 0 });
    expect(result.current.padding.value).toBe(0);
  });
});

describe("`useChatKeyboard` — iOS freeze", () => {
  it("should not change padding on keyboard open", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: true,
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(0);
  });

  it("should not change contentOffsetY on keyboard open", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: true,
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.contentOffsetY!.value).toBe(0);
  });

  it("should not change padding in onEnd", () => {
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: true,
    });

    handlers.onEnd({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(0);
  });
});
