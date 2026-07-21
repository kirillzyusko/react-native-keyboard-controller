import { fireEvent, render } from "@testing-library/react-native";
import { View } from "react-native";

import KeyboardAvoidingView from "..";

import type { LayoutRectangle } from "react-native";

const keyboard = {
  heightWhenOpened: { value: 300 },
  progress: { value: 1 },
  isClosed: { value: true },
};
const translate = { value: 0 };
const padding = { value: 0 };
const animatedStyleUpdaters: Array<() => object> = [];

jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const { View: NativeView } = require("react-native");

  return {
    __esModule: true,
    default: {
      View: React.forwardRef((props: object, ref: unknown) =>
        React.createElement(NativeView, { ...props, ref }),
      ),
    },
    interpolate: (value: number, input: number[], output: number[]) => {
      const progress = (value - input[0]) / (input[1] - input[0]);

      return output[0] + progress * (output[1] - output[0]);
    },
    runOnUI: (worklet: (...args: unknown[]) => unknown) => worklet,
    useAnimatedStyle: (updater: () => object) => {
      animatedStyleUpdaters.push(updater);

      return updater();
    },
    useDerivedValue: (updater: () => unknown) => ({
      get value() {
        return updater();
      },
    }),
    useSharedValue: <T,>(value: T) => ({ value }),
  };
});

jest.mock("../hooks", () => ({
  useKeyboardAnimation: () => keyboard,
  useTranslateAnimation: () => ({ translate, padding }),
}));

jest.mock("../../../hooks", () => ({
  useWindowDimensions: () => ({ height: 800 }),
}));

jest.mock("../../../bindings", () => ({
  KeyboardControllerNative: {
    viewPositionInWindow: jest.fn(),
  },
}));

const restingLayout: LayoutRectangle = {
  x: 0,
  y: 275,
  width: 320,
  height: 280,
};
const paddingAffectedLayout: LayoutRectangle = {
  ...restingLayout,
  y: 220,
  height: 400,
};

/**
 * Evaluates the latest animated-style updater registered by the component.
 *
 * @returns The rendered animated style.
 */
function renderedStyle(): Record<string, number> {
  return animatedStyleUpdaters.at(-1)?.() as Record<string, number>;
}

/**
 * Returns the keyboard displacement property emitted by a given behavior.
 *
 * @param behavior - The `KeyboardAvoidingView` behavior being inspected.
 * @returns The resulting keyboard displacement in points.
 */
function renderedDisplacement(
  behavior: "padding" | "translate-with-padding" | "position",
): number {
  const style = renderedStyle();

  switch (behavior) {
    case "padding":
      return style.paddingBottom;
    case "translate-with-padding":
      return style.paddingTop;
    case "position":
      return style.bottom;
  }
}

describe("KeyboardAvoidingView initial frame", () => {
  beforeEach(() => {
    keyboard.isClosed.value = true;
    padding.value = 0;
    animatedStyleUpdaters.length = 0;
  });

  it.each(["padding", "translate-with-padding"] as const)(
    "keeps the resting frame for %s while the keyboard is open",
    (behavior) => {
      const screen = render(
        <KeyboardAvoidingView behavior={behavior} testID="avoiding-view">
          <View />
        </KeyboardAvoidingView>,
      );

      fireEvent(screen.getByTestId("avoiding-view"), "layout", {
        nativeEvent: { layout: restingLayout },
      });
      keyboard.isClosed.value = false;
      padding.value = 1;

      expect(renderedDisplacement(behavior)).toBe(55);

      // These are the self-generated layout changes caused by animated
      // padding. They must not replace the resting frame.
      fireEvent(screen.getByTestId("avoiding-view"), "layout", {
        nativeEvent: { layout: paddingAffectedLayout },
      });

      expect(renderedDisplacement(behavior)).toBe(55);
    },
  );

  it("continues to refresh the outer frame for position behavior", () => {
    const screen = render(
      <KeyboardAvoidingView behavior="position" testID="avoiding-view">
        <View />
      </KeyboardAvoidingView>,
    );

    fireEvent(screen.getByTestId("avoiding-view"), "layout", {
      nativeEvent: { layout: restingLayout },
    });
    keyboard.isClosed.value = false;

    fireEvent(screen.getByTestId("avoiding-view"), "layout", {
      nativeEvent: { layout: paddingAffectedLayout },
    });

    expect(renderedDisplacement("position")).toBe(120);
  });
});
