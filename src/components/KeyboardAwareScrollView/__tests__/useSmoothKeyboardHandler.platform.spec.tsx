import "../__fixtures__/smoothKeyboardHandler";

import { renderHook } from "@testing-library/react-native";

import {
  event,
  frame,
  loadPlatformHandler,
  mockNativeHandler,
  mockRunReaction,
  useNativeReaction,
  useWebReaction,
} from "../__fixtures__/smoothKeyboardHandler";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("native keyboard event routing", () => {
  it.each([
    ["android", 30],
    ["ios", "26.2"],
  ] as const)("preserves native events on %s %s", (OS, Version) => {
    const { useHandler, timing } = loadPlatformHandler(OS, Version);
    const onStart = jest.fn();
    const onMove = jest.fn();
    const onEnd = jest.fn();
    const { unmount } = renderHook(() => {
      useHandler({ onStart, onMove, onEnd }, []);
    });
    const start = { ...event(300, 42), duration: 123 };
    const move = { ...event(150, 42), duration: 123, progress: 0.5 };

    mockNativeHandler.onStart?.(start);
    mockNativeHandler.onMove?.(move);
    mockNativeHandler.onEnd?.(start);
    mockRunReaction();

    expect(timing).not.toHaveBeenCalled();
    expect(onStart).toHaveBeenCalledWith(start);
    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onMove).toHaveBeenCalledWith(move);
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(onEnd).toHaveBeenCalledWith(start);
    unmount();
  });

  it("continues synthesizing events on Android API 29", () => {
    const { useHandler, timing } = loadPlatformHandler("android", 29);
    const onStart = jest.fn();
    const onMove = jest.fn();
    const onEnd = jest.fn();
    const { unmount } = renderHook(() => {
      useHandler({ onStart, onMove, onEnd }, []);
    });

    mockNativeHandler.onStart?.({ ...event(300), duration: 100 });
    mockNativeHandler.onMove?.(event(300));
    mockNativeHandler.onEnd?.(event(300));
    frame(150);
    frame(300);

    expect(timing).toHaveBeenCalledWith(
      300,
      expect.objectContaining({ duration: 250 }),
    );
    expect(onStart).toHaveBeenCalledWith(event(300));
    expect(onMove.mock.calls.map(([e]) => e.duration)).toEqual([250, 250]);
    expect(onEnd).toHaveBeenCalledTimes(1);
    unmount();
  });
});

describe("Reanimated platform subscriptions", () => {
  it("uses closure changes on native and ignores explicit dependency changes", () => {
    const first = jest.fn();
    const second = jest.fn();
    const { rerender } = renderHook<
      void,
      { handler: (value: number) => void; dependency: number }
    >(
      ({ handler, dependency }) => {
        const prepare = () => 10;
        const react = (value: number) => handler(value);

        // Supply the closure metadata normally added by the worklet Babel plugin.
        Object.assign(react, { __closure: { handler } });
        useNativeReaction(prepare, react, [dependency]);
      },
      { initialProps: { handler: first, dependency: 1 } },
    );

    expect(first).toHaveBeenCalledTimes(1);
    rerender({ handler: first, dependency: 2 });
    expect(first).toHaveBeenCalledTimes(1);
    rerender({ handler: second, dependency: 2 });
    expect(second).toHaveBeenCalledWith(10);
  });

  it("uses explicit dependencies on web without worklet closure metadata", () => {
    const observed = jest.fn();
    const { rerender } = renderHook<void, { value: number }>(
      ({ value }) => {
        useWebReaction(
          () => 10,
          (height) => observed(height, value),
          [value],
        );
      },
      { initialProps: { value: 1 } },
    );

    rerender({ value: 2 });
    expect(observed.mock.calls).toEqual([
      [10, 1],
      [10, 2],
    ]);
  });
});
