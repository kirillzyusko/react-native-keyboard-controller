import { scrollTo } from "react-native-reanimated";

import { safeScrollTo } from "../safeScrollTo";

import type { ScrollView } from "react-native";
import type { AnimatedRef } from "react-native-reanimated";

jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  scrollTo: jest.fn(),
}));

const mockScrollTo = jest.mocked(scrollTo);

beforeEach(() => {
  mockScrollTo.mockClear();
});

describe("safeScrollTo", () => {
  it.each([42, { shadowNode: true }])(
    "scrolls with an attached callable ref (%p)",
    (node) => {
      const ref = jest.fn(() => node) as unknown as AnimatedRef<ScrollView>;

      safeScrollTo(ref, 10, -100, true);

      expect(mockScrollTo).toHaveBeenCalledWith(ref, 10, -100, true);
    },
  );

  it("scrolls with an attached object ref from Reanimated 4.7+", () => {
    const ref = {
      value: { shadowNode: true },
    } as unknown as AnimatedRef<ScrollView>;

    safeScrollTo(ref, 0, 100, false);

    expect(mockScrollTo).toHaveBeenCalledWith(ref, 0, 100, false);
  });

  it.each([null, undefined, 0])("skips an empty callable ref (%p)", (node) => {
    const ref = jest.fn(() => node) as unknown as AnimatedRef<ScrollView>;

    safeScrollTo(ref, 0, 100, false);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it.each([null, undefined])("skips an empty object ref (%p)", (node) => {
    const ref = { value: node } as unknown as AnimatedRef<ScrollView>;

    safeScrollTo(ref, 0, 100, false);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("reads the current node again after the ref is detached", () => {
    const ref = { value: { shadowNode: true } as object | null };
    const animatedRef = ref as unknown as AnimatedRef<ScrollView>;

    safeScrollTo(animatedRef, 0, 100, false);
    ref.value = null;
    safeScrollTo(animatedRef, 0, 200, false);

    expect(mockScrollTo).toHaveBeenCalledTimes(1);
    expect(mockScrollTo).toHaveBeenCalledWith(animatedRef, 0, 100, false);
  });
});
