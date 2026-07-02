import { sv } from "../../../../__fixtures__/sv";
import {
  type Handlers,
  KEYBOARD,
  createRender,
  flushAnimatedReactions,
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

  it("should not change padding on inverted keyboard open", () => {
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
      freeze: true,
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 200 });

    expect(result.current.padding.value).toBe(0);
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

  it("should apply the latest frozen keyboard padding when unfrozen", () => {
    const freeze = sv(false);
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze,
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onEnd({ height: KEYBOARD });
    expect(result.current.padding.value).toBe(KEYBOARD);

    freeze.value = true;
    flushAnimatedReactions();
    handlers.onStart({ height: 0 });
    handlers.onMove({ height: 120 });
    handlers.onEnd({ height: 0 });
    expect(result.current.padding.value).toBe(KEYBOARD);

    freeze.value = false;
    flushAnimatedReactions();

    expect(result.current.padding.value).toBe(0);
  });
});
