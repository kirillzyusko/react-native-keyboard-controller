import "@testing-library/jest-native/extend-expect";
import { act, render } from "@testing-library/react-native";
import React, { useState } from "react";
import { Text } from "react-native";
import { useFocusedInputHandler } from "react-native-keyboard-controller";
import { runOnJS } from "react-native-reanimated";

import type {
  FocusedInputHandler,
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

describe("`useFocusedInputHandler` specification", () => {
  it("should execute all handlers and change corresponding elements", () => {
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
});
