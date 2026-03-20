import "@testing-library/jest-native/extend-expect";
import { render } from "@testing-library/react-native";
import React from "react";
import { useReanimatedFocusedInput } from "react-native-keyboard-controller";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";

function RectangleWithFocusedInputLayout() {
  const { input } = useReanimatedFocusedInput();
  const style = useAnimatedStyle(() => {
    const layout = input.value?.layout;

    return {
      top: layout?.y,
      left: layout?.x,
      height: layout?.height,
      width: layout?.width,
    };
  }, []);

  return <Reanimated.View style={style} testID="view" />;
}

describe("`useReanimatedFocusedInput` mocking", () => {
  it("should have different styles depends on `useReanimatedFocusedInput`", () => {
    const { getByTestId, update } = render(<RectangleWithFocusedInputLayout />);

    expect(getByTestId("view")).toHaveStyle({
      top: 0,
      left: 0,
      width: 200,
      height: 40,
    });

    (useReanimatedFocusedInput as jest.Mock).mockReturnValue({
      input: {
        value: {
          target: 2,
          parentScrollViewTarget: -1,
          layout: {
            x: 10,
            y: 100,
            width: 190,
            height: 80,
            absoluteX: 100,
            absoluteY: 200,
          },
        },
      },
    });
    update(<RectangleWithFocusedInputLayout />);

    expect(getByTestId("view")).toHaveStyle({
      top: 100,
      left: 10,
      width: 190,
      height: 80,
    });
  });
});
