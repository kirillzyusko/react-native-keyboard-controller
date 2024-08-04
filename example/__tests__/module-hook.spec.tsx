import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Button } from "react-native";
import { useKeyboardController } from "react-native-keyboard-controller";

function SwitchModuleOnOff() {
  const { setEnabled, enabled } = useKeyboardController();

  return (
    <Button
      testID="toggle_module"
      title="Toggle module"
      onPress={() => setEnabled(!enabled)}
    />
  );
}

describe("switching module on/off", () => {
  it("should call `setEnabled` with expected params", () => {
    const setEnabled = jest.fn();

    (useKeyboardController as jest.Mock).mockReturnValue({
      setEnabled,
      enabled: true,
    });

    const { getByTestId } = render(<SwitchModuleOnOff />);

    fireEvent.press(getByTestId("toggle_module"));

    expect(setEnabled).toHaveBeenCalledTimes(1);
    expect(setEnabled).toHaveBeenCalledWith(false);
  });
});
