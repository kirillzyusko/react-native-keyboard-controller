import "../__fixtures__/mocks";

import {
  INPUT_LAYOUT_B,
  INPUT_TARGET_B,
  KEYBOARD_HEIGHT,
  inputEvent,
  kbEvent,
  lastScrollToY,
  mockInput,
  mockKeyboardHandlers,
  mockLayout,
  mockOffset,
  mockScrollTo,
  mockSelectionHandler,
  mockSize,
  renderKeyboardAwareScrollView,
  reset,
  selectionEvent,
} from "../__fixtures__/testUtils";

beforeEach(() => {
  reset();
});

describe("KeyboardAwareScrollView — refocus same input", () => {
  // Input B: point = 695.67 + 47 = 742.67
  //   relativeScrollTo = 312 - (928 - 742.67) + 62 = 188.67

  describe("refocus before keyboard hide completes", () => {
    it.each([0.2, 0.5, 0.8])(
      "should preserve the scroll target when refocused at %s of keyboard height",
      async (progress) => {
        await renderKeyboardAwareScrollView();
        // A short form fills the viewport; scrolling uses only the keyboard inset.
        mockSize.value = { ...mockLayout.value };
        mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);
        mockSelectionHandler.current(selectionEvent(INPUT_TARGET_B));
        mockKeyboardHandlers.current.onStart(
          kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
        );
        mockKeyboardHandlers.current.onMove(
          kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
        );

        const initialScroll = lastScrollToY()!;

        expect(initialScroll).toBeCloseTo(188.67, 1);
        mockOffset.value = initialScroll;
        mockKeyboardHandlers.current.onEnd(
          kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
        );

        // Repeat to ensure each interrupted hide uses the same original base.
        for (let cycle = 0; cycle < 3; cycle++) {
          mockKeyboardHandlers.current.onStart(kbEvent(0, INPUT_TARGET_B));
          mockKeyboardHandlers.current.onMove(
            kbEvent(KEYBOARD_HEIGHT * progress, INPUT_TARGET_B),
          );
          mockOffset.value = lastScrollToY()!;
          expect(mockOffset.value).toBeCloseTo(initialScroll * progress, 1);

          // Native focus reports the current input frame, but the target and
          // keyboard height are unchanged. No hide onEnd(0) was delivered.
          mockInput.value = inputEvent(INPUT_TARGET_B, {
            ...INPUT_LAYOUT_B,
            absoluteY: INPUT_LAYOUT_B.absoluteY - mockOffset.value,
          });
          mockScrollTo.mockClear();
          mockKeyboardHandlers.current.onStart(
            kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
          );
          mockKeyboardHandlers.current.onMove(
            kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
          );

          expect(lastScrollToY()).toBeCloseTo(initialScroll, 1);
          mockOffset.value = lastScrollToY()!;
          mockKeyboardHandlers.current.onEnd(
            kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
          );
        }

        // A subsequent uninterrupted hide must still remove the entire inset.
        mockKeyboardHandlers.current.onStart(kbEvent(0, INPUT_TARGET_B));
        mockKeyboardHandlers.current.onMove(kbEvent(0, INPUT_TARGET_B));
        mockOffset.value = lastScrollToY()!;
        mockKeyboardHandlers.current.onEnd(kbEvent(0, INPUT_TARGET_B));

        expect(lastScrollToY()).toBeCloseTo(0, 1);
      },
    );
  });

  describe("iOS 15: refocus after keyboard hide", () => {
    it("should use fresh selection data on refocus", async () => {
      await renderKeyboardAwareScrollView();
      mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);

      // ---- First focus (cursor at y=47) ----
      mockKeyboardHandlers.current.onStart(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );
      mockSelectionHandler.current(selectionEvent(INPUT_TARGET_B, 47, 0));
      mockKeyboardHandlers.current.onMove(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );
      mockKeyboardHandlers.current.onEnd(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );
      mockOffset.value = 189;

      // ---- Keyboard hide ----
      mockKeyboardHandlers.current.onStart(kbEvent(0, INPUT_TARGET_B));
      mockKeyboardHandlers.current.onEnd(kbEvent(0, INPUT_TARGET_B));
      mockOffset.value = 0;

      // ---- Second focus (cursor moved to y=20) ----
      mockScrollTo.mockClear();

      mockKeyboardHandlers.current.onStart(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );
      mockSelectionHandler.current(selectionEvent(INPUT_TARGET_B, 20, 5));
      mockKeyboardHandlers.current.onMove(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );

      // point = 695.67 + 20 = 715.67
      // relativeScrollTo = 312 - (928 - 715.67) + 62 = 161.67
      expect(lastScrollToY()).toBeCloseTo(161.67, 0);

      mockKeyboardHandlers.current.onEnd(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );
    });
  });

  describe("Android: selection not re-emitted on refocus", () => {
    it("should use stale selection as fallback", async () => {
      await renderKeyboardAwareScrollView();
      mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);

      // ---- First focus (selection arrives) ----
      mockSelectionHandler.current(selectionEvent(INPUT_TARGET_B, 47, 0));
      mockKeyboardHandlers.current.onStart(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );
      mockKeyboardHandlers.current.onMove(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );
      mockKeyboardHandlers.current.onEnd(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );
      mockOffset.value = 189;

      // ---- Keyboard hide ----
      mockKeyboardHandlers.current.onStart(kbEvent(0, INPUT_TARGET_B));
      mockKeyboardHandlers.current.onEnd(kbEvent(0, INPUT_TARGET_B));
      mockOffset.value = 0;

      // ---- Second focus (NO selection event — Android behavior) ----
      mockScrollTo.mockClear();

      mockKeyboardHandlers.current.onStart(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );
      // No selectionHandler call — Android doesn't re-emit for same cursor
      mockKeyboardHandlers.current.onMove(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );

      // Must use stale selection (height=47), NOT full input height (60.33)
      expect(lastScrollToY()).toBeCloseTo(188.67, 0);

      mockKeyboardHandlers.current.onEnd(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
      );
    });
  });
});
