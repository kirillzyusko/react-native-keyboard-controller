import { sv } from "../../../../__fixtures__/sv";
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

describe("blankSpace — iOS non-inverted + always", () => {
  it("blankSpace=0 produces identical behavior to default", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
      blankSpace: sv(0),
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(KEYBOARD);
    expect(result.current.contentOffsetY!.value).toBe(400);
  });

  it("full absorption: preserves current scroll position when blankSpace > keyboard", () => {
    // Small content so minimum padding fills viewport (pastContentEnd = 0+800-300 = 500, fraction = 1)
    mockSize.value = { width: 390, height: 300 };
    mockOffset.value = 0;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
      blankSpace: sv(500),
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(KEYBOARD);
    // minimumPaddingAbsorbed=500, scrollEff=0 → contentOffsetY = scroll.value (no shift)
    expect(result.current.contentOffsetY!.value).toBe(0);
  });

  it("partial absorption: reduced content offset displacement", () => {
    // Content slightly smaller than viewport so minimum padding is fully visible
    // (pastContentEnd = 0+800-700 = 100, fraction = 100/100 = 1)
    mockSize.value = { width: 390, height: 700 };
    mockOffset.value = 0;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "always",
      blankSpace: sv(100),
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(KEYBOARD);
    // minimumPaddingAbsorbed=100, scrollEff=200, actualTotalPadding=max(100,300+0)=300
    // relativeScroll = 0 - 0 = 0 (no previous padding)
    // contentOffsetY = computeIOSContentOffset(0, 200, 700, 800, false, 300)
    //   maxScroll = max(700 - 800 + 300, 0) = 200
    //   target = min(max(200 + 0, 0), 200) = 200
    expect(result.current.contentOffsetY!.value).toBe(200);
  });
});

describe("blankSpace — iOS inverted + always", () => {
  it("full absorption: preserves current scroll position (inverted)", () => {
    // Inverted: minimum padding at top, visible when scroll < 0
    // fraction = -(-500)/500 = 1
    mockOffset.value = -500;
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
      blankSpace: sv(500),
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(KEYBOARD);
    // minimumPaddingAbsorbed=500, scrollEff=0 → contentOffsetY = scroll.value
    expect(result.current.contentOffsetY!.value).toBe(-500);
  });

  it("partial absorption: reduced content offset displacement (inverted)", () => {
    // Inverted: fraction = -(-100)/100 = 1
    mockOffset.value = -100;
    const { result } = render({
      inverted: true,
      keyboardLiftBehavior: "always",
      blankSpace: sv(100),
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(KEYBOARD);
    // minimumPaddingAbsorbed=100, scrollEff=200, actualTotalPadding=max(100,300+0)=300
    // relativeScroll = -100 + 0 = -100 (no previous padding)
    // contentOffsetY = computeIOSContentOffset(-100, 200, 2000, 800, true, 300)
    //   maxScroll = max(2000 - 800, 0) = 1200
    //   result = max(min(-100-200, 1200), -300) = max(-300, -300) = -300
    expect(result.current.contentOffsetY!.value).toBe(-300);
  });
});

describe("blankSpace — iOS persistent behavior", () => {
  it("partial visibility: full absorption when visiblePadding >= keyboard", () => {
    // Scroll near end so minimum padding is partially visible
    // (pastContentEnd = 1000+800-1500 = 300, fraction = 300/500 = 0.6)
    // visiblePadding = 300 >= keyboard = 300 → full absorption → no shift
    mockSize.value = { width: 390, height: 1500 };
    mockOffset.value = 1000;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "persistent",
      blankSpace: sv(500),
    });

    // Open keyboard — visiblePadding (300) absorbs keyboard (300) entirely
    // scrollEff = 0 → preserve scroll position
    handlers.onStart({ height: KEYBOARD });
    expect(result.current.contentOffsetY!.value).toBe(1000);

    // Close keyboard — persistent + at end → clamp to valid range
    handlers.onStart({ height: 0 });

    expect(result.current.padding.value).toBe(0);
    // atEnd: 1000+800 >= 1500-20 → true
    // actualTotalPadding = max(500, 0) = 500
    // maxScroll = max(1500-800+500, 0) = 1200
    // clamp: max(0, min(1000, 1200)) = 1000
    expect(result.current.contentOffsetY!.value).toBe(1000);
  });
});

describe("blankSpace — iOS never behavior", () => {
  it("full absorption on close: uses actualTotalPadding when at end", () => {
    mockOffset.value = 100;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "never",
      blankSpace: sv(500),
    });

    // Open keyboard
    handlers.onStart({ height: KEYBOARD });
    expect(result.current.contentOffsetY!.value).toBe(100);

    // Close keyboard — user scrolled to end
    // end with blankSpace: contentHeight - layoutHeight + totalPadding
    // totalPadding on close = max(500, 0+0) = 500
    // maxScroll = 2000 - 800 + 500 = 1700
    mockOffset.value = 1700;
    handlers.onStart({ height: 0 });

    expect(result.current.padding.value).toBe(0);
    // atEnd: 1700 + 800 = 2500 >= 2000 - 20 = 1980 → at end
    // actualTotalPadding = max(500, 0+0) = 500
    // contentOffsetY = max(2000-800+500, 0) = 1700
    expect(result.current.contentOffsetY!.value).toBe(1700);
  });
});

describe("blankSpace — iOS whenAtEnd behavior", () => {
  it("partial visibility: full absorption when visiblePadding >= keyboard", () => {
    // Scroll near end so minimum padding is partially visible
    // (pastContentEnd = 1000+800-1500 = 300, fraction = 300/500 = 0.6)
    // visiblePadding = 300 >= keyboard = 300 → full absorption → no shift
    mockSize.value = { width: 390, height: 1500 };
    mockOffset.value = 1000;
    const { result } = render({
      inverted: false,
      keyboardLiftBehavior: "whenAtEnd",
      blankSpace: sv(500),
    });

    handlers.onStart({ height: KEYBOARD });

    expect(result.current.padding.value).toBe(KEYBOARD);
    // visiblePadding = 300, minimumPaddingAbsorbed = 300
    // scrollEff = max(0, 300-300) = 0 → preserve scroll position
    expect(result.current.contentOffsetY!.value).toBe(1000);
  });
});
