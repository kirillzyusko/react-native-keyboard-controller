import {
  type Handlers,
  KEYBOARD,
  createRender,
  mockOffset,
  mockSize,
  setupBeforeEach,
} from "../__fixtures__/testUtils";

import type { SharedValue } from "react-native-reanimated";

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

// mockSize: { width: 390, height: 2000 }
// mockLayout: { width: 390, height: 800 }
// KEYBOARD = 300
// base maxScroll (no keyboard, no extraContentPadding) = 2000 - 800 = 1200
// maxScroll with keyboard             = 2000 - 800 + 300 = 1500
// maxScroll with keyboard + extraContentPadding=50    = 2000 - 800 + 300 + 50 = 1550

describe("`useChatKeyboard` — iOS extraContentPadding", () => {
  describe("spurious onStart (keyboard height unchanged)", () => {
    it("should not clamp contentOffsetY when extraContentPadding grew between two onStart calls", () => {
      const extraContentPadding = { value: 0 } as SharedValue<number>;

      mockOffset.value = 1200;
      const { result } = render({
        inverted: false,
        keyboardLiftBehavior: "always",
        extraContentPadding,
      });

      // Step 1: keyboard opens, extraContentPadding=0
      handlers.onStart({ height: KEYBOARD });
      expect(result.current.contentOffsetY!.value).toBe(1500);

      // Step 2: text input grows → extraContentPadding=50, scroll pushed to 1550 via scrollTo
      extraContentPadding.value = 50;
      mockOffset.value = 1550;

      // Step 3: spurious onStart — same keyboard height, fired during input resize
      handlers.onStart({ height: KEYBOARD });

      // Must stay at 1550, not be clamped to 1500 (the no-extraContentPadding max)
      expect(result.current.contentOffsetY!.value).toBe(1550);
    });

    it("should not clamp contentOffsetY for inverted list with extraContentPadding", () => {
      // Inverted: extraContentPadding extends the minimum bound from -300 to -350
      const extraContentPadding = { value: 50 } as SharedValue<number>;

      mockOffset.value = -KEYBOARD;
      const { result } = render({
        inverted: true,
        keyboardLiftBehavior: "always",
        extraContentPadding,
      });

      handlers.onStart({ height: KEYBOARD });
      // Simulate scroll pushed further by extraContentPadding
      mockOffset.value = -350;

      // Spurious onStart — same keyboard height
      handlers.onStart({ height: KEYBOARD });

      // Must stay at -350, not be clamped to -300 (the no-extraContentPadding min)
      expect(result.current.contentOffsetY!.value).toBe(-350);
    });
  });

  describe("persistent: snap to end when keyboard shrinks", () => {
    it("should include extraContentPadding in the snap-to-end position", () => {
      const extraContentPadding = { value: 50 } as SharedValue<number>;

      // Scroll at the end (with keyboard + extraContentPadding)
      mockOffset.value = 1550;
      const { result } = render({
        inverted: false,
        keyboardLiftBehavior: "persistent",
        extraContentPadding,
      });

      handlers.onStart({ height: KEYBOARD });

      // Keyboard shrinks by 50px (e.g. QuickType bar disappears)
      mockOffset.value = 1550;
      handlers.onStart({ height: 250 });

      // Snap-to-end = 2000 - 800 + 250 + 50 = 1500
      expect(result.current.contentOffsetY!.value).toBe(1500);
    });
  });

  describe("never: snap to end when keyboard closes", () => {
    it("should include extraContentPadding in the snap-to-end position", () => {
      const extraContentPadding = { value: 50 } as SharedValue<number>;

      mockOffset.value = 100;
      const { result } = render({
        inverted: false,
        keyboardLiftBehavior: "never",
        extraContentPadding,
      });

      handlers.onStart({ height: KEYBOARD });

      // Scroll at the end (with keyboard + extraContentPadding)
      mockOffset.value = 1550;
      handlers.onStart({ height: 0 });

      // Snap-to-end = 2000 - 800 + 0 + 50 = 1250
      expect(result.current.contentOffsetY!.value).toBe(1250);
    });
  });
});
