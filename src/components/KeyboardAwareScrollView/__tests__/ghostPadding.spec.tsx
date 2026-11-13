import "../__fixtures__/mocks";

import {
  KEYBOARD_HEIGHT,
  kbEvent,
  lastScrollToY,
  mockKeyboardHandlers,
  mockLayout,
  mockOffset,
  mockScrollTo,
  mockSize,
  renderKeyboardAwareScrollView,
  reset,
} from "../__fixtures__/testUtils";

beforeEach(() => {
  reset();
});

describe("KeyboardAwareScrollView — ghost padding", () => {
  it.each([
    { name: "short content", offset: -62, content: 300 },
    { name: "the bottom of long content", offset: 878, content: 1800 },
  ])(
    "does not scroll $name when an already hidden keyboard hides",
    async ({ offset, content }) => {
      await renderKeyboardAwareScrollView();
      mockOffset.value = offset;
      mockLayout.value = { width: 440, height: 956 };
      mockSize.value = { width: 440, height: content };

      // iOS can send a zero-height hide on foregrounding without a focused input.
      const hidden = kbEvent(0, -1);

      mockKeyboardHandlers.current.onStart(hidden);
      mockKeyboardHandlers.current.onMove(hidden);
      mockKeyboardHandlers.current.onEnd(hidden);

      expect(mockScrollTo).not.toHaveBeenCalled();
    },
  );

  it("ignores another hide after a real keyboard dismissal", async () => {
    await renderKeyboardAwareScrollView();
    mockOffset.value = -62;
    mockLayout.value = { width: 440, height: 956 };
    mockSize.value = { width: 440, height: 300 };

    const shown = kbEvent(KEYBOARD_HEIGHT, -1);
    const hidden = kbEvent(0, -1);

    mockKeyboardHandlers.current.onStart(shown);
    mockKeyboardHandlers.current.onEnd(shown);
    mockScrollTo.mockClear();

    mockKeyboardHandlers.current.onStart(hidden);
    mockKeyboardHandlers.current.onEnd(hidden);

    // A real hide must still remove the 594pt of ghost space.
    expect(mockScrollTo).toHaveBeenCalledTimes(1);
    expect(lastScrollToY()).toBe(-656);

    // Native inset removal restores the short list's resting offset.
    mockOffset.value = -62;
    mockScrollTo.mockClear();
    mockKeyboardHandlers.current.onStart(hidden);
    mockKeyboardHandlers.current.onEnd(hidden);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});
