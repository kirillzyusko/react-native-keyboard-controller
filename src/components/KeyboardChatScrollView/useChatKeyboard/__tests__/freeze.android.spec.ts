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

describe("`useChatKeyboard` — Android freeze", () => {
  it("should not call scrollTo on keyboard open", () => {
    mockOffset.value = 100;
    render({
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: true,
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 200 });

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should not change containerTranslateY on keyboard open", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
      freeze: true,
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 200 });

    expect(result.current.containerTranslateY.value).toBe(0);
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
