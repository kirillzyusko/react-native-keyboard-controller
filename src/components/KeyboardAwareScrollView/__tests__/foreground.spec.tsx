import "../__fixtures__/mocks";

import {
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

it("foreground", async () => {
  await renderKeyboardAwareScrollView();

  // Case A in the video: a drag populates scroll state, then the short list
  // settles at the automatic top inset. No TextInput has been focused.
  mockOffset.value = -62;
  mockLayout.value = { width: 440, height: 956 };
  mockSize.value = { width: 440, height: 300 };

  // On return from Home, UIKit sends a hide even though the keyboard is hidden.
  const hide = { height: 0, duration: 383, progress: 0, target: -1 };

  mockKeyboardHandlers.current.onStart(hide); // keyboardWillHide
  mockKeyboardHandlers.current.onEnd(hide); // keyboardDidHide; no movement frames

  expect(mockScrollTo).not.toHaveBeenCalled();
});
