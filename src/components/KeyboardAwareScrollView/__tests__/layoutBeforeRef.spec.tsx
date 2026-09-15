import "../__fixtures__/mocks";

import { act, render } from "@testing-library/react-native";
import React from "react";
import { View } from "react-native";

import { findNodeHandle } from "../../../utils/findNodeHandle";
import {
  BOTTOM_OFFSET,
  INPUT_LAYOUT_B,
  INPUT_TARGET_B,
  KEYBOARD_HEIGHT,
  inputEvent,
  kbEvent,
  lastScrollToY,
  mockCapturedOnLayout,
  mockInput,
  mockKeyboardHandlers,
  mockSelectionHandler,
  reset,
  selectionEvent,
} from "../__fixtures__/testUtils";

import type { LayoutChangeEvent } from "react-native";

beforeEach(() => {
  reset();
});

describe("KeyboardAwareScrollView — layout event while the ref is detached", () => {
  // React Navigation 8 keeps paused screens laid out inside a hidden
  // `<Activity>`, so `onLayout` fires while React has detached the ScrollView
  // ref and `findNodeHandle` returns `null`.
  it("still scrolls to the focused input", async () => {
    const KeyboardAwareScrollView = require("../index").default;

    render(
      <KeyboardAwareScrollView bottomOffset={BOTTOM_OFFSET}>
        <View />
      </KeyboardAwareScrollView>,
    );

    jest.mocked(findNodeHandle).mockReturnValueOnce(null);
    await act(async () => {
      mockCapturedOnLayout.current?.({
        nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 812 } },
      } as LayoutChangeEvent);
      await Promise.resolve();
    });

    mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);
    mockKeyboardHandlers.current.onStart(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );
    mockSelectionHandler.current(selectionEvent(INPUT_TARGET_B, 47, 0));
    mockKeyboardHandlers.current.onMove(
      kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
    );

    // point = 695.67 + 47 = 742.67
    // relativeScrollTo = 312 - (928 - 742.67) + 62 = 188.67
    expect(lastScrollToY()).toBeCloseTo(188.67, 0);
  });
});
