import {
  type Handlers,
  KEYBOARD,
  createRender,
  mockOffset,
  mockSize,
  setupBeforeEach,
} from "../__fixtures__/testUtils";

const render = createRender("../index.ios");

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
    size: mockSize,
  })),
}));

beforeEach(() => {
  setupBeforeEach();
});

describe("`useChatKeyboard` — iOS persistent non-inverted", () => {
  it("should push content up on keyboard open", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(KEYBOARD);
    expect(result.current.contentOffsetY!.value).toBe(400);
  });

  it("should snap to end of content on keyboard close when at end", () => {
    mockOffset.value = 1180;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart({ height: KEYBOARD });
    // keyboard pushed us to 1480, which is at end (1480+800 >= 1980)
    mockOffset.value = 1480;
    handlers.onStart({ height: 0 });

    expect(result.current.padding.value).toBe(0);
    // snaps to end of content (2000 - 800 = 1200), not back to 1180
    expect(result.current.contentOffsetY!.value).toBe(1200);
  });

  it("should preserve current scroll position on close when NOT at end", () => {
    mockOffset.value = 1180;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart({ height: KEYBOARD });

    // user scrolls away from end while keyboard is open
    mockOffset.value = 500;
    handlers.onStart({ height: 0 });

    expect(result.current.padding.value).toBe(0);
    // contentOffsetY must match current scroll position so animated props
    // don't re-apply the stale offset from keyboard open
    expect(result.current.contentOffsetY!.value).toBe(500);
  });

  it("should push content up again after close + re-open", () => {
    mockOffset.value = 1180;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "persistent",
    });

    // open → close (user scrolled away)
    handlers.onStart({ height: KEYBOARD });
    mockOffset.value = 500;
    handlers.onStart({ height: 0 });

    expect(result.current.padding.value).toBe(0);

    // re-open → should push up from current position
    handlers.onStart({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(KEYBOARD);
    expect(result.current.contentOffsetY!.value).toBe(800);
  });

  it("should snap to end on keyboard resize when at end", () => {
    mockOffset.value = 1180;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart({ height: KEYBOARD });

    // keyboard shrinks (e.g. emoji → text), user still at end
    mockOffset.value = 1480;
    handlers.onStart({ height: 200 });

    expect(result.current.padding.value).toBe(200);
    // end = 2000 - 800 + 200 = 1400
    expect(result.current.contentOffsetY!.value).toBe(1400);
  });
});

describe("`useChatKeyboard` — iOS persistent inverted", () => {
  it("should push content up on keyboard open", () => {
    mockOffset.value = 0;
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(KEYBOARD);
    expect(result.current.contentOffsetY!.value).toBe(-KEYBOARD);
  });

  it("should preserve current scroll position on close when NOT at end", () => {
    // scrolled to older messages (not at end for inverted)
    mockOffset.value = 500;
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart({ height: KEYBOARD });

    // user scrolls further while keyboard is open
    mockOffset.value = 400;
    handlers.onStart({ height: 0 });

    expect(result.current.padding.value).toBe(0);
    // contentOffsetY must match current scroll position so animated props
    // don't re-apply the stale offset from keyboard open
    expect(result.current.contentOffsetY!.value).toBe(400);
  });

  it("should snap to end on keyboard close when at end", () => {
    // at newest messages (at end for inverted = offset near 0)
    mockOffset.value = 0;
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "persistent",
    });

    handlers.onStart({ height: KEYBOARD });
    // user stays at newest messages with keyboard inset
    mockOffset.value = -300;
    handlers.onStart({ height: 0 });

    expect(result.current.padding.value).toBe(0);
    // -effective where effective = 0 produces -0
    expect(result.current.contentOffsetY!.value).toBe(-0);
  });
});
