import "../__fixtures__/mocks";

import {
  INPUT_LAYOUT_A,
  INPUT_LAYOUT_B,
  INPUT_TARGET_A,
  INPUT_TARGET_B,
  KEYBOARD_HEIGHT,
  inputEvent,
  kbEvent,
  lastScrollToY,
  mockInput,
  mockKeyboardHandlers,
  mockScrollTo,
  mockSelectionHandler,
  renderKeyboardAwareScrollView,
  reset,
  selectionEvent,
} from "../__fixtures__/testUtils";

beforeEach(() => {
  reset();
});

describe("KeyboardAwareScrollView — selection order", () => {
  // Input A: above the keyboard → no scroll needed
  // Input B: below the keyboard → scroll needed
  //
  // visibleRect = 928 - 312 = 616
  //
  // Input A: point = 281.67 + 47 = 328.67
  //   visibleRect - point = 287.33 > bottomOffset(62) → NO scroll
  //
  // Input B: point = 695.67 + 47 = 742.67
  //   visibleRect - point = -126.67 <= bottomOffset(62) → SCROLL
  //   relativeScrollTo = 312 - (928 - 742.67) + 62 = 188.67

  describe("iOS 16+: onSelectionChange → onStart → onMove → onEnd", () => {
    it("should not scroll when input is already visible", async () => {
      await renderKeyboardAwareScrollView();
      mockInput.value = inputEvent(INPUT_TARGET_A, INPUT_LAYOUT_A);

      mockSelectionHandler.current(selectionEvent(INPUT_TARGET_A));
      mockKeyboardHandlers.current.onStart(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A),
      );

      mockScrollTo.mockClear();
      mockKeyboardHandlers.current.onMove(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A),
      );

      expect(mockScrollTo).not.toHaveBeenCalled();

      mockKeyboardHandlers.current.onEnd(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A),
      );
    });
  });

  describe("iOS 15: onStart → onSelectionChange → onMove → onEnd", () => {
    it("should use deferred selection and scroll correctly", async () => {
      await renderKeyboardAwareScrollView();
      mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);

      mockKeyboardHandlers.current.onStart(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );
      mockSelectionHandler.current(selectionEvent(INPUT_TARGET_B));

      mockScrollTo.mockClear();
      mockKeyboardHandlers.current.onMove(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );

      // Must use selection height (47), not full input (60.33)
      expect(lastScrollToY()).toBeCloseTo(188.67, 0);

      mockKeyboardHandlers.current.onEnd(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );
    });
  });
});
