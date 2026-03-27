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
  mockOffset,
  mockScrollTo,
  mockSelectionHandler,
  renderKeyboardAwareScrollView,
  reset,
  selectionEvent,
} from "../__fixtures__/testUtils";

beforeEach(() => {
  reset();
});

const EMOJI_KEYBOARD_HEIGHT = 388;

describe("KeyboardAwareScrollView — keyboard size change (emoji toggle)", () => {
  // Input B: absoluteY=695.67, selectionHeight=47
  // point = 695.67 + 47 = 742.67
  //
  // With text keyboard (312):
  //   visibleRect = 928 - 312 = 616
  //   relativeScrollTo = 312 - (928 - 742.67) + 62 = 188.67
  //
  // With emoji keyboard (388):
  //   visibleRect = 928 - 388 = 540
  //   Corrected absoluteY = 695.67 - 188.67 = 507
  //   point = 507 + 47 = 554
  //   relativeScrollTo = 388 - (928 - 554) + 62 = 76
  //   targetScrollY = 76 + 0 (scrollBeforeKeyboardMovement) = ... but
  //   interpolation base is scrollPosition=188.67, so:
  //   targetScrollY = 76 + 188.67 = 264.67

  it("should not accumulate scroll when switching emoji ↔ text keyboard", async () => {
    await renderKeyboardAwareScrollView();
    mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);

    // ---- First focus — keyboard opens ----
    mockSelectionHandler.current(selectionEvent(INPUT_TARGET_B));
    mockKeyboardHandlers.current.onStart(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockKeyboardHandlers.current.onMove(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockKeyboardHandlers.current.onEnd(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockOffset.value = 188.67;

    // ---- Switch to emoji keyboard (larger) ----
    mockScrollTo.mockClear();

    mockKeyboardHandlers.current.onStart({
      height: EMOJI_KEYBOARD_HEIGHT,
      target: INPUT_TARGET_B,
      duration: 0,
      progress: 1,
    });
    mockKeyboardHandlers.current.onEnd({
      height: EMOJI_KEYBOARD_HEIGHT,
      target: INPUT_TARGET_B,
      duration: 0,
      progress: 1,
    });

    const scrollAfterEmoji = lastScrollToY();

    // Should scroll a bit more (keyboard grew), but NOT double the amount
    expect(scrollAfterEmoji).toBeDefined();
    expect(scrollAfterEmoji!).toBeLessThan(300);

    // Simulate the scroll settling
    mockOffset.value = scrollAfterEmoji!;

    // ---- Switch back to text keyboard (smaller) ----
    mockScrollTo.mockClear();

    mockKeyboardHandlers.current.onStart(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockKeyboardHandlers.current.onEnd(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );

    const scrollAfterText = lastScrollToY();

    // Should scroll back to roughly the original position (~188.67),
    // NOT keep climbing higher
    if (scrollAfterText !== undefined) {
      expect(scrollAfterText).toBeLessThan(250);
    }

    // Key assertion: position should NOT exceed the emoji keyboard scroll
    // (i.e. no accumulation happening)
    expect(scrollAfterText ?? mockOffset.value).toBeLessThan(
      scrollAfterEmoji! + 10,
    );
  });
});
