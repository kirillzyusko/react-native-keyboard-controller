import "../__fixtures__/mocks";

import {
  INPUT_LAYOUT_B,
  INPUT_TARGET_B,
  KEYBOARD_HEIGHT,
  MOCK_SV_PAGE_Y,
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

// When the keyboard changes size (e.g. emoji ↔ text toggle), the native
// FocusedInputObserver calls syncUpLayout(), producing a
// fresh FocusedInputLayoutChanged event with the correct on-screen absoluteY:
//
//   absoluteY = layout.y - currentScrollOffset + scrollViewPageY
//
// In these tests we simulate that by updating mockInput.value before each
// keyboard-resize onStart call.
//
// Input B (used throughout):
//   layout.y = 579.67, height = 60.33, scrollViewPageY = 116
//   selectionHeight = 47  (used as the effective point height)
//
//   absoluteY(scroll) = 579.67 - scroll + 116 = 695.67 - scroll
//
// Text keyboard (312):  visibleRect = 928 - 312 = 616
// Emoji keyboard (388): visibleRect = 928 - 388 = 540

describe("KeyboardAwareScrollView — keyboard size change (emoji toggle)", () => {
  it("should correctly adjust scroll across multiple emoji ↔ text keyboard toggles", async () => {
    await renderKeyboardAwareScrollView();
    mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);

    // ── Step 1: Focus — text keyboard opens ──────────────────────────────────
    // point = 695.67 + 47 = 742.67
    // relativeScrollTo = 312 - (928 - 742.67) + 62 = 188.67
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

    // ── Step 2: → emoji keyboard (should push further) ───────────────────────
    // native sends updated absoluteY = 579.67 - 188.67 + 116 = 507
    // point = 507 + 47 = 554
    // relativeScrollTo = 388 - (928 - 554) + 62 = 76
    // targetScrollY = 76 + 188.67 = 264.67
    mockScrollTo.mockClear();
    mockInput.value = inputEvent(INPUT_TARGET_B, {
      ...INPUT_LAYOUT_B,
      absoluteY: INPUT_LAYOUT_B.y - mockOffset.value + MOCK_SV_PAGE_Y,
    });
    mockKeyboardHandlers.current.onStart(
      kbEvent(EMOJI_KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockKeyboardHandlers.current.onEnd(
      kbEvent(EMOJI_KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );

    const scrollAfterFirstEmoji = lastScrollToY();

    expect(scrollAfterFirstEmoji).toBeDefined();
    expect(scrollAfterFirstEmoji!).toBeCloseTo(264.67, 1);
    mockOffset.value = scrollAfterFirstEmoji!;

    // ── Step 3: → text keyboard (should NOT push further) ────────────────────
    // native sends updated absoluteY = 579.67 - 264.67 + 116 = 431
    // point = 431 + 47 = 478; visibleRect (text) = 616; 616 - 478 = 138 > 62 → no scroll
    mockScrollTo.mockClear();
    mockInput.value = inputEvent(INPUT_TARGET_B, {
      ...INPUT_LAYOUT_B,
      absoluteY: INPUT_LAYOUT_B.y - mockOffset.value + MOCK_SV_PAGE_Y,
    });
    mockKeyboardHandlers.current.onStart(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockKeyboardHandlers.current.onEnd(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );

    expect(lastScrollToY()).toBeUndefined();

    // ── Step 4: → emoji keyboard again (should NOT push further) ─────────────
    // absoluteY still 431 (scroll hasn't changed); point = 478
    // visibleRect (emoji) = 540; 540 - 478 = 62 ≤ 62 → scrollTo called but to same position
    mockScrollTo.mockClear();
    mockKeyboardHandlers.current.onStart(
      kbEvent(EMOJI_KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockKeyboardHandlers.current.onEnd(
      kbEvent(EMOJI_KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );

    expect(lastScrollToY() ?? mockOffset.value).toBeCloseTo(264.67, 1);

    // ── Step 5: → text keyboard again (should NOT push) ──────────────────────
    mockScrollTo.mockClear();
    mockKeyboardHandlers.current.onStart(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockKeyboardHandlers.current.onEnd(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );

    expect(lastScrollToY()).toBeUndefined();

    // ── Step 6: User scrolls back up manually ────────────────────────────────
    mockScrollTo.mockClear();
    mockOffset.value = 188.67;

    // ── Step 7: → emoji keyboard (should push again from new base) ───────────
    // native sends updated absoluteY = 695.67 - 188.67 = 507 (same as step 2)
    // → same scroll target: 264.67
    mockInput.value = inputEvent(INPUT_TARGET_B, {
      ...INPUT_LAYOUT_B,
      absoluteY: INPUT_LAYOUT_B.y - mockOffset.value + MOCK_SV_PAGE_Y,
    });
    mockKeyboardHandlers.current.onStart(
      kbEvent(EMOJI_KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockKeyboardHandlers.current.onEnd(
      kbEvent(EMOJI_KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );

    const scrollAfterThirdEmoji = lastScrollToY();

    expect(scrollAfterThirdEmoji).toBeDefined();
    expect(scrollAfterThirdEmoji!).toBeCloseTo(264.67, 1);
    mockOffset.value = scrollAfterThirdEmoji!;

    // ── Step 8: → text keyboard (should NOT push) ────────────────────────────
    mockScrollTo.mockClear();
    mockInput.value = inputEvent(INPUT_TARGET_B, {
      ...INPUT_LAYOUT_B,
      absoluteY: INPUT_LAYOUT_B.y - mockOffset.value + MOCK_SV_PAGE_Y,
    });
    mockKeyboardHandlers.current.onStart(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockKeyboardHandlers.current.onEnd(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );

    expect(lastScrollToY()).toBeUndefined();

    // ── Step 9: → emoji keyboard (should NOT push again) ─────────────────────
    mockScrollTo.mockClear();
    mockKeyboardHandlers.current.onStart(
      kbEvent(EMOJI_KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockKeyboardHandlers.current.onEnd(
      kbEvent(EMOJI_KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );

    expect(lastScrollToY() ?? mockOffset.value).toBeCloseTo(264.67, 1);
  });
});
