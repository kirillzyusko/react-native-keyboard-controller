import { sv } from "../../../../__fixtures__/sv";
import {
  createRender,
  flushRAF,
  mockScrollTo,
  reactionEffect,
} from "../__fixtures__/setup";

import type { AnimatedRef } from "react-native-reanimated";
import type Reanimated from "react-native-reanimated";

jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");

  RN.Platform.OS = "android";

  return RN;
});

type ScrollViewRef = AnimatedRef<Reanimated.ScrollView>;

// Reanimated < 4.7 exposes the animated ref on the UI runtime as a function.
const functionRef = (node: object | null) =>
  (() => node) as unknown as ScrollViewRef;
// Reanimated >= 4.7 exposes it as a shareable that holds the node in `.value`.
const shareableRef = (node: object | null) =>
  ({ value: node } as unknown as ScrollViewRef);

const renderWithRef = (scrollViewRef: ScrollViewRef) => {
  const render = createRender();

  render({
    scrollViewRef,
    extraContentPadding: sv(0),
    keyboardPadding: sv(0),
    scroll: sv(100),
    layout: sv({ width: 390, height: 800 }),
    size: sv({ width: 390, height: 2000 }),
    inverted: false,
    keyboardLiftBehavior: "always",
    freeze: false,
  });
};

describe("useExtraContentPadding — android deferred scrollTo", () => {
  it("should scrollTo when the ref is a function returning a node", async () => {
    const ref = functionRef({});

    renderWithRef(ref);
    reactionEffect(50, 0);
    await flushRAF();

    expect(mockScrollTo).toHaveBeenCalledWith(ref, 0, 150, false);
  });

  it("should skip scrollTo when the ref function returns null", async () => {
    renderWithRef(functionRef(null));
    reactionEffect(50, 0);
    await flushRAF();

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should scrollTo when the ref is a shareable holding a node", async () => {
    const ref = shareableRef({});

    renderWithRef(ref);
    reactionEffect(50, 0);
    await flushRAF();

    expect(mockScrollTo).toHaveBeenCalledWith(ref, 0, 150, false);
  });

  it("should skip scrollTo when the shareable ref holds null", async () => {
    renderWithRef(shareableRef(null));
    reactionEffect(50, 0);
    await flushRAF();

    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});
