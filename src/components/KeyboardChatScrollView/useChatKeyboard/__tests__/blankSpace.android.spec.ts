import { sv } from "../../../../__fixtures__/sv";
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

describe("blankSpace — Android non-inverted + always", () => {
  it("blankSpace=0 produces identical behavior to default", () => {
    mockOffset.value = 100;
    render({
      inverted: false,
      keyboardLiftBehavior: "always",
      blankSpace: sv(0),
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 300, false);
  });

  it("full absorption: no scroll movement when blankSpace > keyboard", () => {
    // Small content so minimum padding fills viewport (pastContentEnd = 0+800-300 = 500, fraction = 1)
    mockSize.value = { width: 390, height: 300 };
    mockOffset.value = 0;
    render({
      inverted: false,
      keyboardLiftBehavior: "always",
      blankSpace: sv(500),
    });

    handlers.onStart({ height: KEYBOARD });

    // minimumPaddingAbsorbed=500, scrollEff=0 → sentinel set, no scrollTo
    handlers.onMove({ height: KEYBOARD });
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("partial absorption: reduced scroll displacement", () => {
    // Content slightly smaller than viewport so minimum padding is fully visible
    // (pastContentEnd = 0+800-700 = 100, fraction = 100/100 = 1)
    mockSize.value = { width: 390, height: 700 };
    mockOffset.value = 0;
    render({
      inverted: false,
      keyboardLiftBehavior: "always",
      blankSpace: sv(100),
    });

    handlers.onStart({ height: KEYBOARD });
    // minimumPaddingAbsorbed = 100, scrollEff = max(0, 200-100) = 100
    // actualTotalPadding = max(100, 200+0) = 200
    // target = clampedScrollTarget(0, 100, 700, 800, 200)
    //        = min(max(0+100, 0), max(700-800+200, 0))
    //        = min(100, 100) = 100
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 100, false);
  });

  it("full absorption with extraContentPadding: absorbed = blankSpace - extraContentPadding", () => {
    // Small content so minimum padding fills viewport (pastContentEnd = 0+800-300 = 500, fraction = 1)
    mockSize.value = { width: 390, height: 300 };
    mockOffset.value = 0;
    const extraContentPadding = sv(50);

    render({
      inverted: false,
      keyboardLiftBehavior: "always",
      blankSpace: sv(500),
      extraContentPadding,
    });

    handlers.onStart({ height: KEYBOARD });
    // minimumPaddingAbsorbed = max(0, 500 - 50) * 1 = 450
    // scrollEff = max(0, 300 - 450) = 0 → sentinel → no scroll
    handlers.onMove({ height: KEYBOARD });
    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});

describe("blankSpace — Android inverted + always", () => {
  it("full absorption: no scroll movement when blankSpace > keyboard", () => {
    // Inverted: minimum padding at top, visible when scroll < 0
    // fraction = -(-500)/500 = 1
    mockOffset.value = -500;
    render({
      inverted: true,
      keyboardLiftBehavior: "always",
      blankSpace: sv(500),
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    // minimumPaddingAbsorbed=500, scrollEff=0 → guard triggers → no scrollTo
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("partial absorption: reduced scroll displacement (inverted)", () => {
    // Inverted: fraction = -(-100)/100 = 1
    mockOffset.value = -100;
    render({
      inverted: true,
      keyboardLiftBehavior: "always",
      blankSpace: sv(100),
    });

    handlers.onStart({ height: KEYBOARD });
    // minimumPaddingAbsorbed=100, scrollEff=max(0,200-100)=100
    // target = offsetBefore(-100) + padding(300) - scrollEff(100) = 100
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 100, false);
  });
});

describe("blankSpace — Android never behavior", () => {
  it("full absorption: no scroll on close (non-inverted)", () => {
    mockOffset.value = 100;
    render({
      inverted: false,
      keyboardLiftBehavior: "never",
      blankSpace: sv(500),
    });

    // Open keyboard
    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    // Close keyboard
    handlers.onStart({ height: 0 });
    // scrollEff = 0, minimumPaddingAbsorbed = 500 → skip
    handlers.onMove({ height: 150 });
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("full absorption: no scroll on close (inverted)", () => {
    // Inverted: fraction = -(-500)/500 = 1
    mockOffset.value = -500;
    render({
      inverted: true,
      keyboardLiftBehavior: "never",
      blankSpace: sv(500),
    });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockScrollTo.mockClear();

    handlers.onStart({ height: 0 });
    // minimumPaddingAbsorbed=500*1=500, scrollEff=0 → skip
    handlers.onMove({ height: 150 });
    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});

describe("blankSpace — Android whenAtEnd behavior", () => {
  it("full absorption prevents scroll even when at end", () => {
    // Small content so minimum padding fills viewport (pastContentEnd = 0+800-300 = 500, fraction = 1)
    // Position at end: 0 + 800 >= 300 - 20
    mockSize.value = { width: 390, height: 300 };
    mockOffset.value = 0;
    render({
      inverted: false,
      keyboardLiftBehavior: "whenAtEnd",
      blankSpace: sv(500),
    });

    handlers.onStart({ height: KEYBOARD });
    // minimumPaddingAbsorbed=500, scrollEff=0 → sentinel → no scroll
    handlers.onMove({ height: KEYBOARD });
    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});

describe("blankSpace — Android non-inverted, blankSpace grown while the keyboard is open", () => {
  /**
   * Opens the keyboard at the end of a list with no `blankSpace`
   * (1200 → 1500), then sends a message: the content grows by 200, room is
   * kept under it and the page scrolls the message to the top.
   *
   * @param scroll - Where the page scrolls the sent message to.
   * @returns The `blankSpace` shared value.
   * @example pinWhileOpen(1900);
   */
  function pinWhileOpen(scroll: number) {
    const blankSpace = sv(0);

    mockOffset.value = 1200;
    render({ inverted: false, keyboardLiftBehavior: "whenAtEnd", blankSpace });

    handlers.onStart({ height: KEYBOARD });
    handlers.onMove({ height: KEYBOARD });
    mockOffset.value = 1500;
    handlers.onEnd({ height: KEYBOARD });

    mockSize.value = { width: 390, height: 2200 };
    blankSpace.value = 600;
    mockOffset.value = scroll;
    mockScrollTo.mockClear();

    return blankSpace;
  }

  it("keeps a message pinned to the top in place when the keyboard covers only blankSpace", () => {
    // viewport ends 500 past the content: the keyboard (300) covers blankSpace only
    pinWhileOpen(1900);

    handlers.onStart({ height: 0 });
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      1900,
      false,
    );
    handlers.onMove({ height: 0 });
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      1900,
      false,
    );
  });

  it("unwinds only the content under the keyboard, and never lifts it", () => {
    // viewport ends 150 past the content: the keyboard covers 150 of
    // blankSpace and 150 of content, so the content moves down by 150
    pinWhileOpen(1550);

    handlers.onStart({ height: 0 });
    handlers.onMove({ height: 200 });
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      1550,
      false,
    );
    handlers.onMove({ height: 100 });
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      1500,
      false,
    );
    handlers.onMove({ height: 0 });
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      1400,
      false,
    );
  });
});
