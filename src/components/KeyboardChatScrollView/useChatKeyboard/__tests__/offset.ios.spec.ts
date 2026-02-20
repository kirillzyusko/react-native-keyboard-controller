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
});

const OFFSET = 50;

describe("`useChatKeyboard` — iOS non-inverted + offset", () => {
  it("should set padding to effective height", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
      offset: OFFSET,
    });

    handlers.onStart({ height: KEYBOARD });

    // effective = interpolate(300, [0, 300], [0, 250]) = 250
    expect(result.current.padding.value).toBe(KEYBOARD - OFFSET);
  });

  it("should compute contentOffsetY with effective height", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
      offset: OFFSET,
    });

    handlers.onStart({ height: KEYBOARD });

    // effective = 250
    // contentOffsetY = computeIOSContentOffset(100, 250, 2000, 800, false)
    //   = min(max(250 + 100, 0), max(2000 - 800 + 250, 0))
    //   = min(350, 1450) = 350
    expect(result.current.contentOffsetY!.value).toBe(350);
  });

  it("should restore contentOffsetY on keyboard close", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
      offset: OFFSET,
    });

    handlers.onStart({ height: KEYBOARD });
    // effective padding = 250, user is now at scroll offset 350
    mockOffset.value = 350;
    handlers.onStart({ height: 0 });

    // relativeScroll = 350 - 250 = 100 (original position)
    // effective = interpolate(0, [0, 300], [0, 250]) = 0
    // padding = 0
    // contentOffsetY = computeIOSContentOffset(100, 0, 2000, 800, false)
    //   = min(max(0 + 100, 0), max(2000 - 800, 0)) = 100
    expect(result.current.padding.value).toBe(0);
    expect(result.current.contentOffsetY!.value).toBe(100);
  });

  it("should not call scrollTo on iOS", () => {
    render({
      inverted: false,
      keyboardLiftBehavior: "always",
      offset: OFFSET,
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 150 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should finalize padding with effective height in onEnd", () => {
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
      offset: OFFSET,
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onEnd({ height: KEYBOARD });
    expect(result.current.padding.value).toBe(KEYBOARD - OFFSET);

    handlers.onEnd({ height: 0 });
    expect(result.current.padding.value).toBe(0);
  });
});

describe("`useChatKeyboard` — iOS inverted + offset", () => {
  it("should set inverted contentOffsetY with effective height", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
      offset: OFFSET,
    });

    handlers.onStart({ height: KEYBOARD });

    // effective = 250
    // contentOffsetY = computeIOSContentOffset(0, 250, 2000, 800, true)
    //   = 0 - 250 = -250
    expect(result.current.contentOffsetY!.value).toBe(-(KEYBOARD - OFFSET));
  });
});
