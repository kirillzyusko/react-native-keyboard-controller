import {
  type Handlers,
  KEYBOARD,
  createRender,
  mockLayout,
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
    layout: mockLayout,
    size: mockSize,
  })),
}));

beforeEach(() => {
  setupBeforeEach();
});

// e.g. a transparent header: `contentInset={{ top: 100 }}`
const TOP = 100;

describe("`useChatKeyboard` — iOS non-inverted + `contentInset.top`", () => {
  it("should return to `-contentInset.top` after open + close when scrolled to the top", () => {
    mockOffset.value = -TOP;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
      minScroll: -TOP,
    });

    handlers.onStart({ height: KEYBOARD });

    // -100 + 300 = 200
    expect(result.current.contentOffsetY!.value).toBe(200);

    mockOffset.value = 200;
    handlers.onStart({ height: 0 });

    // 200 - 300 = -100, not clamped to 0
    expect(result.current.contentOffsetY!.value).toBe(-TOP);
  });

  it("should keep short content at `-contentInset.top` on open and close", () => {
    mockOffset.value = -TOP;
    mockSize.value = { width: 390, height: 200 };
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
      minScroll: -TOP,
    });

    handlers.onStart({ height: KEYBOARD });

    // maxScroll = max(200 - 800 + 300, -100) = -100
    expect(result.current.contentOffsetY!.value).toBe(-TOP);

    handlers.onStart({ height: 0 });

    expect(result.current.contentOffsetY!.value).toBe(-TOP);
  });

  it("should clamp to `-contentInset.top` when the keyboard shrinks in persistent mode", () => {
    mockOffset.value = -TOP;
    mockSize.value = { width: 390, height: 200 };
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "persistent",
      minScroll: -TOP,
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onStart({ height: 0 });

    expect(result.current.padding.value).toBe(0);
    expect(result.current.contentOffsetY!.value).toBe(-TOP);
  });

  it("should clamp to `-contentInset.top` when the keyboard shrinks in never mode", () => {
    mockOffset.value = -TOP;
    mockSize.value = { width: 390, height: 200 };
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "never",
      minScroll: -TOP,
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.contentOffsetY!.value).toBe(-TOP);

    handlers.onStart({ height: 0 });

    expect(result.current.padding.value).toBe(0);
    expect(result.current.contentOffsetY!.value).toBe(-TOP);
  });
});
