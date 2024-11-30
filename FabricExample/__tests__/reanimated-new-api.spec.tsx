import "@testing-library/jest-native/extend-expect";
import { render } from "@testing-library/react-native";
import React from "react";
import {
  useReanimatedFocusedInput,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";

function TestKeyboardMovementComponent() {
  const { height } = useReanimatedKeyboardAnimation();
  const style = useAnimatedStyle(
    () => ({
      width: 20,
      height: 20,
      backgroundColor: "red",
      transform: [{ translateY: height.get() }],
    }),
    [],
  );

  return <Reanimated.View style={style} testID="view" />;
}

function TestFocusedInputLayoutComponent() {
  const { input } = useReanimatedFocusedInput();
  const style = useAnimatedStyle(() => {
    const layout = input.get()?.layout;

    return {
      top: layout?.y,
      left: layout?.x,
      height: layout?.height,
      width: layout?.width,
    };
  }, []);

  return <Reanimated.View style={style} testID="view" />;
}

describe("basic keyboard interaction", () => {
  it("should have default style with new reanimated API", () => {
    const { getByTestId } = render(<TestKeyboardMovementComponent />);

    expect(getByTestId("view")).toHaveStyle({ transform: [{ translateY: 0 }] });
  });

  it("should have default style with `useReanimatedFocusedInput` using new reanimated API", () => {
    const { getByTestId } = render(<TestFocusedInputLayoutComponent />);

    expect(getByTestId("view")).toHaveStyle({
      top: 0,
      left: 0,
      width: 200,
      height: 40,
    });
  });
});
