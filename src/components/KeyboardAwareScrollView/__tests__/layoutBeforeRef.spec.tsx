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

// Unlike `renderKeyboardAwareScrollView`, doesn't fire `onLayout`.
const renderScrollView = async () => {
  const KeyboardAwareScrollView = require("../index").default;

  render(
    <KeyboardAwareScrollView bottomOffset={BOTTOM_OFFSET}>
      <View />
    </KeyboardAwareScrollView>,
  );

  await act(async () => {
    await Promise.resolve();
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  });
};

const focusInput = () => {
  mockInput.value = inputEvent(INPUT_TARGET_B, INPUT_LAYOUT_B);
  mockKeyboardHandlers.current.onStart(
    kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B),
  );
  mockSelectionHandler.current(selectionEvent(INPUT_TARGET_B, 47, 0));
  mockKeyboardHandlers.current.onMove(kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_B));
};

// point = 695.67 + 47 = 742.67
// relativeScrollTo = 312 - (928 - 742.67) + 62 = 188.67
const EXPECTED_SCROLL_Y = 188.67;

describe("KeyboardAwareScrollView — scroll view target", () => {
  it("is resolved by the effect, without a layout event", async () => {
    await renderScrollView();

    focusInput();

    expect(lastScrollToY()).toBeCloseTo(EXPECTED_SCROLL_Y, 0);
  });

  it("is kept when onLayout fires with a detached ref", async () => {
    await renderScrollView();

    jest.mocked(findNodeHandle).mockReturnValueOnce(null);
    await act(async () => {
      mockCapturedOnLayout.current?.({
        nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 812 } },
      } as LayoutChangeEvent);
      await Promise.resolve();
    });

    focusInput();

    expect(lastScrollToY()).toBeCloseTo(EXPECTED_SCROLL_Y, 0);
  });
});
