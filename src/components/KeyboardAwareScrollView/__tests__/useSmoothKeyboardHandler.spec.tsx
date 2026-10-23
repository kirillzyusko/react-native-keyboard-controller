import "../__fixtures__/smoothKeyboardHandler";

import { renderHook } from "@testing-library/react-native";
import { Platform } from "react-native";

import {
  event,
  frame,
  mockAnimation,
  mockNativeDependencies,
  mockNativeHandler,
  mockRunReaction,
  renderHandler,
} from "../__fixtures__/smoothKeyboardHandler";
import { useSmoothKeyboardHandler } from "../useSmoothKeyboardHandler";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Android legacy keyboard animation subscriptions", () => {
  it("does not replay a completed keyboard transition when bottomOffset changes", () => {
    expect(Platform.Version).toBe(28);
    const { rerender, onMove, onEnd } = renderHandler();

    mockNativeHandler.onStart?.(event(300));
    frame();
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
    frame();
    rerender({ bottomOffset: 250 });
    onStart.mockClear();
    onMove.mockClear();
    onEnd.mockClear();

    mockNativeHandler.onStart?.(event(400));
    frame();

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onMove).toHaveBeenCalledWith(event(400));
    expect(onEnd).toHaveBeenCalledWith(event(400));
  });

  it("dispatches same-height focus changes directly without replaying movement", () => {
    const { rerender, onStart, onMove, onEnd } = renderHandler();

    mockNativeHandler.onStart?.(event(300));
    frame();
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
    frame();
    mockNativeHandler.onStart?.(event(0));
    frame();
    mockRunReaction();
    rerender({ bottomOffset: 250 });
    mockNativeHandler.onStart?.(event(300));
    frame();

    expect(onMove.mock.calls.map(([e]) => e.height)).toEqual([300, 0, 300]);
    expect(onEnd.mock.calls.map(([e]) => e.height)).toEqual([300, 0, 300]);
  });

  it("finishes from the prepared frame even if the live height advances during onMove", () => {
    const { onMove, onEnd } = renderHandler();

    mockNativeHandler.onStart?.(event(300));
    onMove.mockImplementationOnce(() => {
      mockAnimation.value.value = 300;
    });
    frame(290);

    expect(onEnd).not.toHaveBeenCalled();
    mockRunReaction();
    mockRunReaction();
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(onEnd).toHaveBeenCalledWith(event(300));
  });

  it.each(["before", "after"])(
    "completes hiding once when native onEnd arrives %s the last synthetic frame",
    (nativeEnd) => {
      const { onMove, onEnd } = renderHandler();

      mockNativeHandler.onStart?.(event(300));
      frame();
      onMove.mockClear();
      onEnd.mockClear();

      mockNativeHandler.onStart?.(event(0));
      frame(240);

      if (nativeEnd === "before") {
        mockNativeHandler.onEnd?.(event(0));
      }
      frame(150);
      expect(onEnd).not.toHaveBeenCalled();
      frame(0);

      if (nativeEnd === "after") {
        mockNativeHandler.onEnd?.(event(0));
      }
      mockRunReaction();
      mockRunReaction();

      expect(onMove.mock.calls.map(([e]) => e.progress)).toEqual([0.8, 0.5, 0]);
      expect(onEnd).toHaveBeenCalledTimes(1);
      expect(onEnd).toHaveBeenCalledWith(event(0));
    },
  );

  it("dispatches the first resize frame when only progress changes", () => {
    const { onMove, onEnd } = renderHandler();

    mockNativeHandler.onStart?.(event(300));
    frame();
    onMove.mockClear();
    onEnd.mockClear();

    mockNativeHandler.onStart?.(event(400));
    frame(300);
    expect(onMove).toHaveBeenCalledWith({ ...event(300), progress: 0.75 });
    expect(onEnd).not.toHaveBeenCalled();
    frame(400);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("tracks a new focus target when an opening transition is interrupted", () => {
    const { onMove, onEnd } = renderHandler();

    mockNativeHandler.onStart?.(event(300, 1));
    frame(0);
    mockNativeHandler.onStart?.(event(400, 2));
    frame(0);

    expect(onMove.mock.calls.map(([e]) => e.target)).toEqual([1, 2]);
    frame(300);
    expect(onEnd).not.toHaveBeenCalled();
    frame(400);
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(onEnd).toHaveBeenCalledWith(event(400, 2));
  });

  it("ignores native movement and completion while the synthetic animation runs", () => {
    const { onStart, onMove, onEnd } = renderHandler();

    mockNativeHandler.onStart?.({ ...event(300), duration: 100 });
    mockNativeHandler.onMove?.(event(300));
    mockNativeHandler.onEnd?.(event(300));

    expect(onStart).toHaveBeenCalledWith(event(300));
    expect(onMove).not.toHaveBeenCalled();
    expect(onEnd).not.toHaveBeenCalled();
    frame(150);
    frame(300);
    expect(onMove.mock.calls.map(([e]) => e.duration)).toEqual([250, 250]);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("keeps callbacks stable until dependencies change, then uses the new captured value", () => {
    const observed = jest.fn();
    const { rerender } = renderHook<
      void,
      { bottomOffset: number; label: string }
    >(
      ({ bottomOffset, label }) => {
        useSmoothKeyboardHandler(
          {
            onStart: () => observed("start", bottomOffset, label),
            onMove: () => observed("move", bottomOffset, label),
            onEnd: () => observed("end", bottomOffset, label),
          },
          [bottomOffset],
        );
      },
      { initialProps: { bottomOffset: 200, label: "first" } },
    );

    mockNativeHandler.onStart?.(event(300));
    frame();
    observed.mockClear();
    rerender({ bottomOffset: 200, label: "second" });
    expect(observed).not.toHaveBeenCalled();
    mockNativeHandler.onStart?.(event(300, 2));
    expect(observed.mock.calls).toEqual([
      ["start", 200, "first"],
      ["end", 200, "first"],
    ]);

    observed.mockClear();
    rerender({ bottomOffset: 250, label: "second" });
    expect(observed).not.toHaveBeenCalled();
    mockNativeHandler.onStart?.(event(400, 3));
    frame(350);
    frame(400);
    expect(observed.mock.calls).toEqual([
      ["start", 250, "second"],
      ["move", 250, "second"],
      ["move", 250, "second"],
      ["end", 250, "second"],
    ]);
  });

  it("does not mutate dependencies shared with the native keyboard subscription", () => {
    const dependencies = Object.freeze([200]) as unknown as unknown[];
    const { rerender } = renderHook(() => {
      useSmoothKeyboardHandler({}, dependencies);
    });

    rerender(undefined);
    expect(dependencies).toEqual([200]);
    expect(mockNativeDependencies).toBe(dependencies);
  });
});
