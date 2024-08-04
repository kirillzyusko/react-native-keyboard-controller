jest.unmock("react-native-reanimated");
jest.useFakeTimers();

global.ReanimatedDataMock = {
  now: () => 0,
};

import "@testing-library/jest-native/extend-expect";
import { render } from "@testing-library/react-native";
import React from "react";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import type {
  KeyboardHandler,
  NativeEvent,
} from "react-native-keyboard-controller";

function TestComponent() {
  const height = useSharedValue(0);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";
        // eslint-disable-next-line react-compiler/react-compiler
        height.value = e.height;
      },
      onMove: (e) => {
        "worklet";
        height.value = e.height;
      },
      onEnd: (e) => {
        "worklet";
        height.value = e.height;
      },
    },
    [],
  );
  const style = useAnimatedStyle(
    () => ({
      width: 20,
      height: 20,
      backgroundColor: "red",
      transform: [{ translateY: height.value }],
    }),
    [],
  );

  return <Reanimated.View style={style} testID="view" />;
}

describe("keyboard handler specification", () => {
  it("should execute all handlers and change corresponding style properties", () => {
    let handlers: KeyboardHandler = {};

    (useKeyboardHandler as jest.Mock).mockImplementation(
      (handler) => (handlers = handler),
    );

    const onStart = (e: NativeEvent) => handlers.onStart?.(e);
    const onMove = (e: NativeEvent) => handlers.onMove?.(e);
    const onEnd = (e: NativeEvent) => handlers.onEnd?.(e);
    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId("view")).toHaveStyle({ transform: [{ translateY: 0 }] });

    onStart({ height: 100, progress: 1, duration: 250, target: 123 });
    jest.advanceTimersByTime(100);

    expect(getByTestId("view")).toHaveAnimatedStyle({
      transform: [{ translateY: 100 }],
    });

    onMove({ height: 20, progress: 0.2, duration: 250, target: 123 });
    jest.advanceTimersByTime(100);

    expect(getByTestId("view")).toHaveAnimatedStyle({
      transform: [{ translateY: 20 }],
    });

    onEnd({ height: 100, progress: 1, duration: 250, target: 123 });
    jest.advanceTimersByTime(100);

    expect(getByTestId("view")).toHaveAnimatedStyle({
      transform: [{ translateY: 100 }],
    });
  });
});
