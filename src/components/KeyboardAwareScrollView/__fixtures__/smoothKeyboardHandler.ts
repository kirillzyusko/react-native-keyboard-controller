import { renderHook } from "@testing-library/react-native";
import * as mockReact from "react";
import { Platform } from "react-native";

import { useSmoothKeyboardHandler } from "../useSmoothKeyboardHandler";

import type { KeyboardHandler, NativeEvent } from "../../../types";
import type * as Reanimated from "react-native-reanimated";

export let mockNativeHandler: KeyboardHandler;
export let mockRunReaction: () => void;
export let mockNativeDependencies: unknown[] | undefined;
export let mockAnimation: { value: { value: unknown }; target: number };

jest.mock("../../../hooks", () => ({
  useKeyboardHandler: (handler: KeyboardHandler, dependencies?: unknown[]) => {
    mockNativeHandler = handler;
    mockNativeDependencies = dependencies;
  },
}));

jest.mock("react-native/Libraries/Utilities/Platform", () => ({
  __esModule: true,
  default: {
    OS: "android",
    Version: 28,
    select: (options: Record<string, unknown>) =>
      options.android ?? options.default,
  },
}));

jest.mock("react-native-reanimated/src/hook/useSharedValue", () => ({
  useSharedValue: (initial: unknown) => {
    const ref = mockReact.useRef<{ value: unknown } | null>(null);

    if (ref.current === null) {
      let current = initial;

      ref.current = {
        get value() {
          return current;
        },
        set value(next: unknown) {
          if (
            next &&
            typeof next === "object" &&
            "testAnimation" in next &&
            "target" in next &&
            typeof next.target === "number"
          ) {
            mockAnimation = { value: ref.current!, target: next.target };
          } else {
            current = next;
          }
        },
      };
    }

    return ref.current;
  },
}));

jest.mock("react-native-reanimated", () => ({
  ...jest.requireActual("react-native-reanimated/mock"),
  ...jest.requireMock("react-native-reanimated/src/hook/useSharedValue"),
  useAnimatedReaction: jest.requireActual(
    "react-native-reanimated/src/hook/useAnimatedReaction",
  ).useAnimatedReaction,
  // Keep the current value until the test advances an animation frame.
  withTiming: jest.fn((target: number) => ({ testAnimation: true, target })),
}));

jest.mock("react-native-reanimated/src/core", () => ({
  ...jest.requireActual("react-native-reanimated/src/core"),
  // The reaction hook is real; only UI mapper execution is controlled.
  startMapper: (mapper: () => void) => {
    mockRunReaction = mapper;
    mapper();

    return 1;
  },
  stopMapper: jest.fn(),
}));

// Hook tests use explicit dependencies without the worklet Babel plugin.
// Wrapper integration tests below load the actual native and web modules.
jest.mock("../../../reanimated", () =>
  jest.requireActual("react-native-reanimated/src/hook/useAnimatedReaction"),
);

export const { useAnimatedReaction: useNativeReaction } = jest.requireActual<
  typeof Reanimated
>("../../../reanimated.native");
export const { useAnimatedReaction: useWebReaction } = jest.requireActual<
  typeof Reanimated
>("../../../reanimated.ts");

export const event = (height: number, target = 1): NativeEvent => ({
  height,
  target,
  duration: 250,
  progress: height > 0 ? 1 : 0,
});

export const frame = (height = mockAnimation.target) => {
  mockAnimation.value.value = height;
  mockRunReaction();
};

export const renderHandler = () => {
  const onStart = jest.fn();
  const onMove = jest.fn();
  const onEnd = jest.fn();
  const { rerender } = renderHook<void, { bottomOffset: number }>(
    ({ bottomOffset }) => {
      useSmoothKeyboardHandler({ onStart, onMove, onEnd }, [bottomOffset]);
    },
    { initialProps: { bottomOffset: 200 } },
  );

  return { rerender, onStart, onMove, onEnd };
};

export const loadPlatformHandler = (OS: string, Version: number | string) => {
  let useHandler = useSmoothKeyboardHandler;
  let timing: jest.Mock = jest.fn();

  jest.isolateModules(() => {
    // Share the renderer's React while re-evaluating the platform constants.
    jest.doMock("react", () => mockReact);
    jest.doMock("react-native", () =>
      Object.create(jest.requireActual("react-native"), {
        Platform: { value: { ...Platform, OS, Version } },
      }),
    );
    useHandler = jest.requireActual<{
      useSmoothKeyboardHandler: typeof useSmoothKeyboardHandler;
    }>("../useSmoothKeyboardHandler").useSmoothKeyboardHandler;
    timing = jest.requireMock("react-native-reanimated").withTiming;
  });

  return { useHandler, timing };
};
