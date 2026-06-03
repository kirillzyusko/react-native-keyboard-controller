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

describe("KeyboardAwareScrollView — toolbar focus switch", () => {
  it("should scroll to newly focused input via deferred selection", async () => {
    await renderKeyboardAwareScrollView();
    mockInput.value = inputEvent(INPUT_TARGET_A, INPUT_LAYOUT_A);

    // ---- Focus input A — keyboard opens, no scroll needed ----
    mockSelectionHandler.current(selectionEvent(INPUT_TARGET_A));
    mockKeyboardHandlers.current.onStart(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A),
    );
    mockKeyboardHandlers.current.onMove(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A),
    );
    mockKeyboardHandlers.current.onEnd(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A),
    );

    // ---- Toolbar moves focus to input B (keyboard stays visible) ----
    // Native sends onStart → onEnd (no animation, duration=0)
    // then onSelectionChange arrives
    mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);
    mockScrollTo.mockClear();

    mockKeyboardHandlers.current.onStart(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockKeyboardHandlers.current.onEnd(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );

    // Selection arrives AFTER onEnd — the pendingSelectionForFocus flag
    // must survive onEnd so the deferred scroll runs here
    mockSelectionHandler.current(selectionEvent(INPUT_TARGET_B, 47, 0));

    // point = 695.67 + 47 = 742.67
    // relativeScrollTo = 312 - (928 - 742.67) + 62 = 188.67
    expect(lastScrollToY()).toBeCloseTo(188.67, 0);
  });

  it("should not cancel an animated same-height focus scroll when ghost padding is positive", async () => {
    await renderKeyboardAwareScrollView();
    mockInput.value = inputEvent(INPUT_TARGET_A, INPUT_LAYOUT_A);

    // Focus input A so the keyboard is already visible and the next focus
    // change is a same-height keyboard event.
    mockSelectionHandler.current(selectionEvent(INPUT_TARGET_A));
    mockKeyboardHandlers.current.onStart(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A),
    );
    mockKeyboardHandlers.current.onEnd(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A),
    );

    mockLayout.value = { width: 402, height: 636.67 };
    mockSize.value = { width: 370, height: 1050 };
    mockOffset.value = 638.33;
    mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);
    mockScrollTo.mockClear();

    // iOS can deliver the fresh selection before the same-height onStart.
    // onStart then issues the animated scroll and computes positive ghost space.
    mockSelectionHandler.current(selectionEvent(INPUT_TARGET_B, 47, 0));
    mockKeyboardHandlers.current.onStart(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockKeyboardHandlers.current.onEnd(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );

    expect(mockScrollTo).toHaveBeenCalledTimes(1);
    expect(mockScrollTo.mock.calls[0][2]).toBeCloseTo(827, 0);
    expect(mockScrollTo.mock.calls[0][3]).toBe(true);
  });
});
