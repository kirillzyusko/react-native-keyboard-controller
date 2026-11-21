import { render } from "@testing-library/react-native";
import React from "react";
import { StyleSheet } from "react-native";

import KeyboardAvoidingView from "..";

import type { KeyboardAvoidingViewProps } from "..";
import type { ViewStyle } from "react-native";

jest.mock("../../../bindings", () => ({ KeyboardControllerNative: {} }));
jest.mock("../../../hooks", () => ({
  useWindowDimensions: () => ({ width: 390, height: 800 }),
}));
jest.mock("../hooks", () => ({
  useKeyboardAnimation: () => ({
    progress: { value: 1 },
    heightWhenOpened: { value: 300 },
    isClosed: { value: false },
  }),
  useTranslateAnimation: () => ({
    translate: { value: 1 },
    padding: { value: 1 },
  }),
}));

const behaviors: {
  behavior: NonNullable<KeyboardAvoidingViewProps["behavior"]>;
  defaults: ViewStyle;
}[] = [
  { behavior: "height", defaults: { height: "auto", flex: undefined } },
  { behavior: "position", defaults: { bottom: "auto" } },
  { behavior: "padding", defaults: { paddingBottom: 0 } },
  {
    behavior: "translate-with-padding",
    defaults: { paddingTop: 0, transform: [] },
  },
];
const originalStyle: ViewStyle = {
  height: 420,
  flex: 1,
  bottom: 12,
  paddingBottom: 16,
  paddingTop: 7,
  transform: [{ scale: 0.9 }],
};

describe.each(behaviors)(
  "KeyboardAvoidingView $behavior",
  ({ behavior, defaults }) => {
    it.each([undefined, originalStyle])(
      "restores the original style %p when disabled",
      (style) => {
        const props = {
          behavior,
          style,
          contentContainerStyle: style,
          testID: "avoiding-view",
        };
        const view = render(<KeyboardAvoidingView {...props} />);

        view.rerender(<KeyboardAvoidingView {...props} enabled={false} />);

        const container = view.getByTestId("avoiding-view");
        const animatedContainer =
          behavior === "position" ? container.children[0] : container;
        const appliedStyle = StyleSheet.flatten(
          typeof animatedContainer !== "string" &&
            animatedContainer.props.style,
        ) as ViewStyle;

        // Disabled views must overwrite the properties left by the last animated frame.
        for (const property of Object.keys(defaults) as (keyof ViewStyle)[]) {
          expect(appliedStyle).toHaveProperty(
            property,
            style?.[property] ?? defaults[property],
          );
        }
      },
    );
  },
);

describe("disabled padding styles", () => {
  it.each<{ style: ViewStyle; expected: number }>([
    { style: { padding: 11 }, expected: 11 },
    { style: { padding: 11, paddingVertical: 19 }, expected: 19 },
  ])("preserves shorthand padding $style", ({ style, expected }) => {
    const view = render(
      <KeyboardAvoidingView
        behavior="padding"
        enabled={false}
        style={style}
        testID="avoiding-view"
      />,
    );

    expect(view.getByTestId("avoiding-view")).toHaveStyle({
      paddingBottom: expected,
    });
  });
});
