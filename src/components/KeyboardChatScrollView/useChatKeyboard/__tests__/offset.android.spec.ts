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
  it("should set containerTranslateY to negative effective height", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
      offset: OFFSET,
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 200 });
    // effective = interpolate(200, [0, 300], [0, 250]) = 166.67
    const effective = 200 * ((KEYBOARD - OFFSET) / KEYBOARD);

    expect(result.current.containerTranslateY.value).toBeCloseTo(-effective);
  });

  it("should reset containerTranslateY on keyboard close", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
      offset: OFFSET,
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    handlers.onEnd({ height: 0 });

    expect(result.current.containerTranslateY.value).toBe(0);
    expect(result.current.padding.value).toBe(0);
  });
});
