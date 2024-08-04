import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Button } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";

function CloseKeyboard() {
  return (
    <Button
      testID="close_keyboard"
      title="Close keyboard"
      onPress={() => KeyboardController.dismiss()}
    />
  );
}

describe("closing keyboard flow", () => {
  it("should have a mock version of `KeyboardController.dismiss`", () => {
    const { getByTestId } = render(<CloseKeyboard />);

    fireEvent.press(getByTestId("close_keyboard"));

    expect(KeyboardController.dismiss).toBeCalledTimes(1);
  });
});
