import { renderHook } from "@testing-library/react-native";
import { Platform } from "react-native";

import { useSmoothKeyboardHandler } from "../useSmoothKeyboardHandler";

import type { KeyboardHandler, NativeEvent } from "../../../types";

let mockNativeHandler: KeyboardHandler;
let mockRunReaction: () => void;

jest.mock("../../../hooks", () => ({
  useKeyboardHandler: (handler: KeyboardHandler) => {
    mockNativeHandler = handler;
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

jest.mock("react-native-reanimated", () => {
  const { useRef } = require("react");

  return {
    ...require("react-native-reanimated/mock"),
    useSharedValue: (value: unknown) => useRef({ value }).current,
    withTiming: (value: number) => value,
  };
});

jest.mock("../../../reanimated", () => {
  const { useEffect, useRef } = require("react");

  return {
    useAnimatedReaction: (
      prepare: () => unknown,
      react: (current: unknown, previous: unknown) => void,
      dependencies: unknown[],
    ) => {
      // Reanimated preserves the previous value when it restarts a mapper.
      // Each new mapper also runs immediately, without a native keyboard event.
      const previous = useRef(null);

      useEffect(() => {
        mockRunReaction = () => {
          const current = prepare();

          react(current, previous.current);
          previous.current = current;
        };
        mockRunReaction();
        // Match Reanimated's mapper restart when handler dependencies change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, dependencies);
    },
  };
});

const event = (height: number, target = 1): NativeEvent => ({
  height,
  target,
  duration: 250,
  progress: height > 0 ? 1 : 0,
});

const renderHandler = () => {
  const onStart = jest.fn();
  const onMove = jest.fn();
  const onEnd = jest.fn();
  const { rerender } = renderHook(
    ({ bottomOffset }) => {
      useSmoothKeyboardHandler({ onStart, onMove, onEnd }, [bottomOffset]);
    },
    { initialProps: { bottomOffset: 200 } },
  );

  return { rerender, onStart, onMove, onEnd };
};

describe("Android legacy keyboard animation subscriptions", () => {
  it("does not replay a completed keyboard transition when bottomOffset changes", () => {
    expect(Platform.Version).toBe(28);
    const { rerender, onMove, onEnd } = renderHandler();

    mockNativeHandler.onStart?.(event(300));
    mockRunReaction();
    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onEnd).toHaveBeenCalledTimes(1);
    onMove.mockClear();
    onEnd.mockClear();

    rerender({ bottomOffset: 250 });
    rerender({ bottomOffset: 200 });

    expect(onMove).not.toHaveBeenCalled();
    expect(onEnd).not.toHaveBeenCalled();
  });

  it("continues to dispatch real keyboard resizes after resubscribing", () => {
    const { rerender, onStart, onMove, onEnd } = renderHandler();

    mockNativeHandler.onStart?.(event(300));
    mockRunReaction();
    rerender({ bottomOffset: 250 });
    onStart.mockClear();
    onMove.mockClear();
    onEnd.mockClear();

    mockNativeHandler.onStart?.(event(400));
    mockRunReaction();

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onMove).toHaveBeenCalledWith(event(400));
    expect(onEnd).toHaveBeenCalledWith(event(400));
  });

  it("dispatches same-height focus changes directly without replaying movement", () => {
    const { rerender, onStart, onMove, onEnd } = renderHandler();

    mockNativeHandler.onStart?.(event(300));
    mockRunReaction();
    onStart.mockClear();
    onMove.mockClear();
    onEnd.mockClear();

    mockNativeHandler.onStart?.(event(300, 2));
    rerender({ bottomOffset: 250 });

    expect(onStart).toHaveBeenCalledWith(event(300, 2));
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(onEnd).toHaveBeenCalledWith(event(300, 2));
    expect(onMove).not.toHaveBeenCalled();
  });

  it("dispatches hiding and reopening at the same height", () => {
    const { rerender, onMove, onEnd } = renderHandler();

    mockNativeHandler.onStart?.(event(300));
    mockRunReaction();
    mockNativeHandler.onStart?.(event(0));
    mockRunReaction();
    mockRunReaction();
    rerender({ bottomOffset: 250 });
    mockNativeHandler.onStart?.(event(300));
    mockRunReaction();

    expect(onMove.mock.calls.map(([e]) => e.height)).toEqual([300, 0, 300]);
    expect(onEnd.mock.calls.map(([e]) => e.height)).toEqual([300, 0, 300]);
  });
});
