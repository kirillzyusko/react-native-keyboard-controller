import "../__fixtures__/mocks";

import { act, render } from "@testing-library/react-native";
import React, { Activity } from "react";
import { View } from "react-native";

import { findNodeHandle } from "../../../utils/findNodeHandle";
import {
  BOTTOM_OFFSET,
  INPUT_LAYOUT_B,
  INPUT_TARGET_B,
  KEYBOARD_HEIGHT,
  MOCK_SV_TARGET,
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

afterEach(() => {
  jest.mocked(findNodeHandle).mockImplementation(() => MOCK_SV_TARGET);
});

const Screen = ({ mode }: { mode: "hidden" | "visible" }) => {
  const KeyboardAwareScrollView = require("../index").default;

  return (
    <Activity mode={mode}>
      <KeyboardAwareScrollView bottomOffset={BOTTOM_OFFSET}>
        <View />
      </KeyboardAwareScrollView>
    </Activity>
  );
};

const fireLayout = () => {
  expect(mockCapturedOnLayout.current).not.toBeNull();
  mockCapturedOnLayout.current?.({
    nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 812 } },
  } as LayoutChangeEvent);
};

// Let `synchronize` continue after `await update`, then drain its scheduled frame.
const flushFrame = () =>
  act(async () => {
    await Promise.resolve();
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  });

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
  it("is resolved when a hidden Activity becomes visible", async () => {
    // React detaches refs inside a hidden `<Activity>`.
    let refAttached = false;

    jest
      .mocked(findNodeHandle)
      .mockImplementation(() => (refAttached ? MOCK_SV_TARGET : null));

    const { rerender } = render(<Screen mode="hidden" />);

    await act(async () => {
      fireLayout();
      await Promise.resolve();
    });

    refAttached = true;
    rerender(<Screen mode="visible" />);
    await flushFrame();

    focusInput();

    expect(lastScrollToY()).toBeCloseTo(EXPECTED_SCROLL_Y, 0);
  });

  it("is kept when onLayout fires with a detached ref", async () => {
    render(<Screen mode="visible" />);
    await flushFrame();

    jest.mocked(findNodeHandle).mockReturnValueOnce(null);
    await act(async () => {
      fireLayout();
      await Promise.resolve();
    });

    focusInput();

    expect(lastScrollToY()).toBeCloseTo(EXPECTED_SCROLL_Y, 0);
  });
});
