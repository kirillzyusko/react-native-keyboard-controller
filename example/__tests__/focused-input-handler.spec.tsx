import "@testing-library/jest-native/extend-expect";
import { act, render } from "@testing-library/react-native";
import React, { useState } from "react";
import { Text } from "react-native";
import { useFocusedInputHandler } from "react-native-keyboard-controller";
import { runOnJS } from "react-native-reanimated";

import type {
  FocusedInputHandler,
  FocusedInputSelectionChangedEvent,
  FocusedInputTextChangedEvent,
} from "react-native-keyboard-controller";

function WhatUserTyped() {
  const [text, setText] = useState("");

  useFocusedInputHandler({
    onChangeText: (e) => {
      "worklet";

      runOnJS(setText)(e.text);
    },
  });

  return <Text testID="text">{text}</Text>;
}

function WhatUserSelected() {
  const [selection, setSelection] = useState<
    FocusedInputSelectionChangedEvent["selection"]
  >({
    start: { x: 6, y: 6, position: 6 },
    end: { x: 6, y: 6, position: 6 },
  });

  useFocusedInputHandler({
    onSelectionChange: (e) => {
      "worklet";

      runOnJS(setSelection)(e.selection);
    },
  });

  return (
    <>
      <Text testID="position">
        {selection.start.position} to {selection.end.position}
      </Text>
      <Text testID="x">
        {selection.start.x} to {selection.end.x}
      </Text>
      <Text testID="y">
        {selection.start.y} to {selection.end.y}
      </Text>
    </>
  );
}

describe("`useFocusedInputHandler` specification", () => {
  it("should execute `onChangeText` handler and change corresponding elements", () => {
    let handlers: FocusedInputHandler = {};

    (useFocusedInputHandler as jest.Mock).mockImplementation(
      (handler) => (handlers = handler),
    );

    const onChangeText = (e: FocusedInputTextChangedEvent) =>
      handlers.onChangeText?.(e);

    const { getByTestId } = render(<WhatUserTyped />);

    expect(getByTestId("text")).toHaveTextContent("");
    act(() => onChangeText({ text: "1" }));

    expect(getByTestId("text")).toHaveTextContent("1");

    act(() => onChangeText({ text: "12" }));

    expect(getByTestId("text")).toHaveTextContent("12");

    act(() => onChangeText({ text: "123" }));

    expect(getByTestId("text")).toHaveTextContent("123");

    act(() => onChangeText({ text: "" }));

    expect(getByTestId("text")).toHaveTextContent("");
  });

  it("should execute `onSelectionChange` handler and change corresponding elements", () => {
    let handlers: FocusedInputHandler = {};

    (useFocusedInputHandler as jest.Mock).mockImplementation(
      (handler) => (handlers = handler),
    );

    const onSelectionChange = (e: FocusedInputSelectionChangedEvent) =>
      handlers.onSelectionChange?.(e);

    const { getByTestId } = render(<WhatUserSelected />);

    expect(getByTestId("position")).toHaveTextContent("6 to 6");
    expect(getByTestId("x")).toHaveTextContent("6 to 6");
    expect(getByTestId("y")).toHaveTextContent("6 to 6");

    act(() =>
      onSelectionChange({
        target: 1,
        selection: {
          start: { x: 0, y: 0, position: 0 },
          end: { x: 6, y: 6, position: 6 },
        },
      }),
    );

    expect(getByTestId("position")).toHaveTextContent("0 to 6");
    expect(getByTestId("x")).toHaveTextContent("0 to 6");
    expect(getByTestId("y")).toHaveTextContent("0 to 6");

    act(() =>
      onSelectionChange({
        target: 1,
        selection: {
          start: { x: 0, y: 0, position: 0 },
          end: { x: 6, y: 6, position: 6 },
        },
      }),
    );
  });
});
