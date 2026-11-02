import "../__fixtures__/mocks";

import { renderAsync, screen, userEvent } from "@testing-library/react-native";
import React, { useState } from "react";
import { TextInput } from "react-native";

import ScrollViewWithBottomPadding from "../../ScrollViewWithBottomPadding";
import {
  INPUT_TARGET_A,
  KEYBOARD_HEIGHT,
  kbEvent,
  mockKeyboardHandlers,
  reset,
} from "../__fixtures__/testUtils";
import KeyboardAwareScrollView from "../index";

const StatefulInput = () => {
  const [value, setValue] = useState("");

  return (
    <TextInput placeholder="Message" value={value} onChangeText={setValue} />
  );
};

beforeEach(reset);

describe("KeyboardAwareScrollView — mode", () => {
  it("preserves child state when switching modes", async () => {
    const user = userEvent.setup();

    await renderAsync(
      <KeyboardAwareScrollView mode="layout">
        <StatefulInput />
      </KeyboardAwareScrollView>,
    );
    await user.type(screen.getByPlaceholderText("Message"), "Draft");

    await screen.rerenderAsync(
      <KeyboardAwareScrollView mode="insets">
        <StatefulInput />
      </KeyboardAwareScrollView>,
    );
    expect(screen.getByPlaceholderText("Message")).toHaveDisplayValue("Draft");

    await screen.rerenderAsync(
      <KeyboardAwareScrollView mode="layout">
        <StatefulInput />
      </KeyboardAwareScrollView>,
    );
    expect(screen.getByPlaceholderText("Message")).toHaveDisplayValue("Draft");
  });

  it.each([
    ["layout", true, 0],
    ["insets", true, KEYBOARD_HEIGHT],
    ["insets", false, 0],
  ] as const)(
    "uses dynamic padding %s (enabled=%s)",
    async (mode, enabled, expectedPadding) => {
      await renderAsync(<KeyboardAwareScrollView mode={mode} />);
      mockKeyboardHandlers.current.onEnd(
        kbEvent(KEYBOARD_HEIGHT, INPUT_TARGET_A),
      );

      await screen.rerenderAsync(
        <KeyboardAwareScrollView enabled={enabled} mode={mode} />,
      );

      expect(
        screen.UNSAFE_getByType(ScrollViewWithBottomPadding).props.bottomPadding
          .value,
      ).toBe(expectedPadding);
    },
  );
});
