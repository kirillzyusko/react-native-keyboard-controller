import "@testing-library/jest-native/extend-expect";
import { render } from "@testing-library/react-native";
import React from "react";
import { Animated } from "react-native";
import { useKeyboardAnimation } from "react-native-keyboard-controller";

function TestComponent() {
  const { height } = useKeyboardAnimation();

  return (
    <Animated.View
      style={{ transform: [{ translateY: height }] }}
      testID="view"
    />
  );
}

describe("basic keyboard interaction", () => {
  it("should have different styles depends on position", () => {
    const { getByTestId, update } = render(<TestComponent />);

    expect(getByTestId("view")).toHaveStyle({ transform: [{ translateY: 0 }] });

    (useKeyboardAnimation as jest.Mock).mockReturnValue({
      height: new Animated.Value(150),
      progress: new Animated.Value(0.5),
    });
    update(<TestComponent />);

    expect(getByTestId("view")).toHaveStyle({
      transform: [{ translateY: 150 }],
    });

    (useKeyboardAnimation as jest.Mock).mockReturnValue({
      height: new Animated.Value(300),
      progress: new Animated.Value(1),
    });
    update(<TestComponent />);

    expect(getByTestId("view")).toHaveStyle({
      transform: [{ translateY: 300 }],
    });
  });
});
