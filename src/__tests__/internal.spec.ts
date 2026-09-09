import { renderHook } from "@testing-library/react-native";

import { useEventHandlerRegistration } from "../internal";
import { findNodeHandle } from "../utils/findNodeHandle";

type WorkletHandler = {
  registerForEvents: jest.Mock<void, [number]>;
  unregisterFromEvents: jest.Mock<void, [number]>;
};
type EventHandler = Parameters<
  ReturnType<typeof useEventHandlerRegistration>
>[0];

const VIEW = 1;
const VIEW_TAG = 42;

jest.mock("../utils/findNodeHandle", () => ({
  findNodeHandle: jest.fn(),
}));

const mockedFindNodeHandle = jest.mocked(findNodeHandle);

/**
 * Create a mocked worklet handler.
 *
 * @returns A worklet handler with mocked registration methods.
 */
function createWorkletHandler(): WorkletHandler {
  return {
    registerForEvents: jest.fn(),
    unregisterFromEvents: jest.fn(),
  };
}

/**
 * Render the registration hook for a mutable view ref.
 *
 * @param viewTagRef - Ref containing the current view handle.
 * @returns The handler registration function.
 */
function renderRegistration(viewTagRef: React.MutableRefObject<number | null>) {
  return renderHook(() => useEventHandlerRegistration(viewTagRef)).result
    .current;
}

beforeEach(() => {
  mockedFindNodeHandle.mockReset();
  mockedFindNodeHandle.mockImplementation((view) =>
    view === null ? null : VIEW_TAG,
  );
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe("useEventHandlerRegistration", () => {
  it("should support the handler shape from Reanimated 3.8 and newer", () => {
    const viewTagRef = { current: VIEW };
    const workletEventHandler = createWorkletHandler();
    const register = renderRegistration(viewTagRef);

    const cleanup = register({
      workletEventHandler,
    } as unknown as EventHandler);

    expect(workletEventHandler.registerForEvents).toHaveBeenCalledWith(
      VIEW_TAG,
    );

    cleanup();

    expect(workletEventHandler.unregisterFromEvents).toHaveBeenCalledWith(
      VIEW_TAG,
    );
  });

  it("should support the ref handler shape from Reanimated 3.0 through 3.7", () => {
    const viewTagRef = { current: VIEW };
    const workletEventHandler = createWorkletHandler();
    const register = renderRegistration(viewTagRef);

    const cleanup = register({
      current: workletEventHandler,
    } as unknown as EventHandler);

    expect(workletEventHandler.registerForEvents).toHaveBeenCalledWith(
      VIEW_TAG,
    );

    cleanup();

    expect(workletEventHandler.unregisterFromEvents).toHaveBeenCalledWith(
      VIEW_TAG,
    );
  });

  it("should attach handlers after the view becomes available", async () => {
    const viewTagRef = { current: null as number | null };
    const workletEventHandler = createWorkletHandler();
    const register = renderRegistration(viewTagRef);

    const cleanup = register({
      workletEventHandler,
    } as unknown as EventHandler);

    expect(workletEventHandler.registerForEvents).not.toHaveBeenCalled();

    viewTagRef.current = VIEW;
    await Promise.resolve();

    expect(workletEventHandler.registerForEvents).toHaveBeenCalledWith(
      VIEW_TAG,
    );

    cleanup();
  });

  it("should attach handlers immediately when the view is available", () => {
    const viewTagRef = { current: VIEW };
    const workletEventHandler = createWorkletHandler();
    const register = renderRegistration(viewTagRef);

    register({ workletEventHandler } as unknown as EventHandler);

    expect(workletEventHandler.registerForEvents).toHaveBeenCalledWith(
      VIEW_TAG,
    );
  });

  it("should ignore a deferred attachment after cleanup", async () => {
    const viewTagRef = { current: null as number | null };
    const workletEventHandler = createWorkletHandler();
    const register = renderRegistration(viewTagRef);
    const cleanup = register({
      workletEventHandler,
    } as unknown as EventHandler);

    cleanup();
    viewTagRef.current = VIEW;
    await Promise.resolve();

    expect(workletEventHandler.registerForEvents).not.toHaveBeenCalled();
  });

  it("should not resolve a tag or warn after provider teardown", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    const viewTagRef = { current: null };
    const workletEventHandler = createWorkletHandler();
    const register = renderRegistration(viewTagRef);
    const cleanup = register({
      workletEventHandler,
    } as unknown as EventHandler);

    cleanup();
    await Promise.resolve();

    expect(mockedFindNodeHandle).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    expect(workletEventHandler.registerForEvents).not.toHaveBeenCalled();
    expect(workletEventHandler.unregisterFromEvents).not.toHaveBeenCalled();
  });

  it("should keep a later registration active after an earlier one is cancelled", async () => {
    const viewTagRef = { current: null as number | null };
    const workletEventHandler = createWorkletHandler();
    const handler = { workletEventHandler } as unknown as EventHandler;
    const register = renderRegistration(viewTagRef);
    const cancelFirstRegistration = register(handler);

    cancelFirstRegistration();

    const cleanup = register(handler);

    viewTagRef.current = VIEW;
    await Promise.resolve();

    expect(workletEventHandler.registerForEvents).toHaveBeenCalledTimes(1);
    expect(workletEventHandler.registerForEvents).toHaveBeenCalledWith(
      VIEW_TAG,
    );

    cleanup();

    expect(workletEventHandler.unregisterFromEvents).toHaveBeenCalledTimes(1);
    expect(workletEventHandler.unregisterFromEvents).toHaveBeenCalledWith(
      VIEW_TAG,
    );
  });

  it("should remove handlers after the view ref is cleared", () => {
    const viewTagRef = { current: VIEW as number | null };
    const workletEventHandler = createWorkletHandler();
    const register = renderRegistration(viewTagRef);
    const cleanup = register({
      workletEventHandler,
    } as unknown as EventHandler);

    viewTagRef.current = null;
    cleanup();

    expect(workletEventHandler.unregisterFromEvents).toHaveBeenCalledWith(
      VIEW_TAG,
    );
  });

  it("should not attach or remove handlers when the view is unavailable", async () => {
    const viewTagRef = { current: null };
    const workletEventHandler = createWorkletHandler();
    const register = renderRegistration(viewTagRef);
    const cleanup = register({
      workletEventHandler,
    } as unknown as EventHandler);

    await Promise.resolve();
    cleanup();

    expect(workletEventHandler.registerForEvents).not.toHaveBeenCalled();
    expect(workletEventHandler.unregisterFromEvents).not.toHaveBeenCalled();
  });
});
