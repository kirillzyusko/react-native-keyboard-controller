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

const OFFSET = 50;

describe("`useChatKeyboard` — Android non-inverted + offset", () => {
  it("should set padding to effective height (keyboard - offset)", () => {
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

  it("should scrollTo with effective height per-frame", () => {
    mockOffset.value = 100;
    render({
      inverted: false,
      keyboardLiftBehavior: "always",
      offset: OFFSET,
    });

    handlers.onStart({ height: KEYBOARD });

    handlers.onMove({ height: 150 });
    // effective = interpolate(150, [0, 300], [0, 250]) = 125
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      225,
      false,
    );

    handlers.onMove({ height: KEYBOARD });
    // effective = 250
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      350,
      false,
    );
  });

  it("should scroll back correctly on keyboard close with offset", () => {
    mockOffset.value = 100;
    render({
      inverted: false,
      keyboardLiftBehavior: "always",
      offset: OFFSET,
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    // user didn't scroll — offset stays at 100 + 250 = 350
    mockOffset.value = 350;
    mockScrollTo.mockClear();

    // keyboard closes: offsetBeforeScroll = 350 - 250 = 100
    handlers.onStart({ height: 0 });

    handlers.onMove({ height: 150 });
    // effective = interpolate(150, [0, 300], [0, 250]) = 125
    // target = clamp(100 + 125, 0, ...) = 225
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      225,
      false,
    );
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

describe("`useChatKeyboard` — Android inverted + offset", () => {
  it("should call scrollTo with effective height per-frame", () => {
    render({
      inverted: true,
      keyboardLiftBehavior: "always",
      offset: OFFSET,
    });

    handlers.onStart({ height: KEYBOARD });
    // padding = effective = interpolate(300, [0, 300], [0, 250]) = 250

    handlers.onMove({ height: 200 });
    // effective = interpolate(200, [0, 300], [0, 250]) = 166.67
    // target = offsetBeforeScroll(0) + padding(250) - effective(166.67) = 83.33
    const effective = 200 * ((KEYBOARD - OFFSET) / KEYBOARD);

    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      expect.closeTo(KEYBOARD - OFFSET - effective),
      false,
    );
  });

  it("should reset padding on keyboard close", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
      offset: OFFSET,
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    handlers.onEnd({ height: 0 });

    expect(result.current.padding.value).toBe(0);
  });
});
