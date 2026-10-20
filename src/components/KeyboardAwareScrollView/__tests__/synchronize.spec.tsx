import "../__fixtures__/mocks";

import { screen } from "@testing-library/react-native";
import React from "react";
import { View } from "react-native";

import {
  BOTTOM_OFFSET,
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

const KeyboardAwareScrollView = require("../index").default;

beforeEach(reset);
afterEach(() => jest.restoreAllMocks());

it("does not add a keyboard scroll twice when the offset changes after measurement", async () => {
  await renderKeyboardAwareScrollView();
  mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);
  mockSelectionHandler.current(selectionEvent(INPUT_TARGET_B, 47, 0));
  mockKeyboardHandlers.current.onStart(
    kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
  );
  mockKeyboardHandlers.current.onMove(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
  mockOffset.value = 189;
  mockKeyboardHandlers.current.onEnd(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));

  mockInput.value = inputEvent(INPUT_TARGET_B, {
    ...INPUT_LAYOUT_B,
    absoluteY: INPUT_LAYOUT_B.absoluteY - mockOffset.value,
  });
  mockScrollTo.mockClear();

  const frames: Parameters<typeof requestAnimationFrame>[0][] = [];

  jest.spyOn(global, "requestAnimationFrame").mockImplementation((callback) => {
    frames.push(callback);

    return frames.length;
  });

  await screen.rerenderAsync(
    <KeyboardAwareScrollView bottomOffset={BOTTOM_OFFSET + 50}>
      <View />
    </KeyboardAwareScrollView>,
  );
  expect(frames).toHaveLength(1);

  // A keyboard callback already moved the view, but the measured input still
  // describes its position before that scroll. The deferred scroll must reuse
  // the offset captured alongside that measurement.
  mockOffset.value = 239;
  frames[0](0);

  expect(lastScrollToY()).toBeCloseTo(238.67, 0);
});
