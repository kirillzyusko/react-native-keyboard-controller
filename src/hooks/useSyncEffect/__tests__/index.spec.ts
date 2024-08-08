import { renderHook } from "@testing-library/react-hooks";

import useSyncEffect from "../index";

describe("scenarios when `useSyncEffect` should call `effect`", () => {
  it("should call `effect` every re-render if no deps are provided", () => {
    const cleanup = jest.fn();
    const effect = jest.fn().mockReturnValue(cleanup);
    const { rerender, unmount } = renderHook(() => useSyncEffect(effect));

    expect(effect).toHaveBeenCalledTimes(1); // will be called on mount

    rerender(); // simulate parent update
    expect(effect).toHaveBeenCalledTimes(2); // it should call update, since no deps were provided
    expect(cleanup).toHaveBeenCalledTimes(1); // it should call cleanup, since new effect was run

    rerender(); // simulate new parent update
    expect(effect).toHaveBeenCalledTimes(3); // it should call update, since no deps were provided
    expect(cleanup).toHaveBeenCalledTimes(2); // it should call cleanup, since new effect was run

    unmount();
    expect(effect).toHaveBeenCalledTimes(3); // shouldn't call effect on unmount
    expect(cleanup).toHaveBeenCalledTimes(3); // should call cleanup on unmount again
  });

  it("should call `effect` only on mount, if `deps=[]`", () => {
    const cleanup = jest.fn();
    const effect = jest.fn().mockReturnValue(cleanup);
    const { rerender, unmount } = renderHook(() => useSyncEffect(effect, []));

    expect(effect).toHaveBeenCalledTimes(1); // will be called on mount
    expect(cleanup).toHaveBeenCalledTimes(0);

    rerender(); // simulate parent update
    expect(effect).toHaveBeenCalledTimes(1); // re-render from outside should be skipped
    expect(cleanup).toHaveBeenCalledTimes(0);

    rerender(); // simulate parent update
    expect(effect).toHaveBeenCalledTimes(1); // re-render from outside should be skipped
    expect(cleanup).toHaveBeenCalledTimes(0);

    unmount();
    expect(effect).toHaveBeenCalledTimes(1); // shouldn't call effect on unmount
    expect(cleanup).toHaveBeenCalledTimes(1); // should call cleanup on unmount again
  });

  it("should call `effect` when deps were changed", () => {
    const cleanup = jest.fn();
    const effect = jest.fn().mockReturnValue(cleanup);
    let dep1 = 1;
    let dep2 = {};
    const { rerender, unmount } = renderHook(() =>
      useSyncEffect(effect, [dep1, dep2]),
    );

    expect(cleanup).toHaveBeenCalledTimes(0);
    expect(effect).toHaveBeenCalledTimes(1); // will be called on mount

    rerender();
    expect(cleanup).toHaveBeenCalledTimes(0);
    expect(effect).toHaveBeenCalledTimes(1); // deps weren't changed, so `effect` shouldn't be called

    dep1 = 2;
    rerender();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenCalledTimes(2); // one dep was changed, so it should call `effect`

    rerender();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenCalledTimes(2); // deps weren't changed, so `effect` shouldn't be called

    dep2 = { newProperty: true };
    rerender();
    expect(cleanup).toHaveBeenCalledTimes(2);
    expect(effect).toHaveBeenCalledTimes(3); // second dep was changed, so it should call `effect`

    rerender();
    expect(cleanup).toHaveBeenCalledTimes(2);
    expect(effect).toHaveBeenCalledTimes(3); // deps weren't changed, so `effect` shouldn't be called

    dep1 = 3;
    dep2 = { newProperty: true, anotherProperty: false };
    rerender();
    // deps were changed simultaneously, so it should call `effect` (only once)
    expect(cleanup).toHaveBeenCalledTimes(3);
    expect(effect).toHaveBeenCalledTimes(4);

    rerender();
    expect(cleanup).toHaveBeenCalledTimes(3);
    expect(effect).toHaveBeenCalledTimes(4); // deps weren't changed, so `effect` shouldn't be called

    unmount();
    expect(cleanup).toHaveBeenCalledTimes(4); // should call cleanup on unmount again
    expect(effect).toHaveBeenCalledTimes(4);
  });

  it("shouldn't not memoize `effect` and `cleanup` when deps changed", () => {
    const cleanup1 = jest.fn();
    const effect1 = jest.fn().mockReturnValue(cleanup1);
    const cleanup2 = jest.fn();
    const effect2 = jest.fn().mockReturnValue(cleanup2);
    let effect = effect1;
    let dep1 = 1;
    let dep2 = 2;
    const { rerender, unmount } = renderHook(() =>
      useSyncEffect(effect, [dep1, dep2]),
    );

    expect(effect1).toHaveBeenCalledTimes(1);
    expect(cleanup1).toHaveBeenCalledTimes(0);
    expect(effect2).toHaveBeenCalledTimes(0);
    expect(cleanup2).toHaveBeenCalledTimes(0);

    rerender();
    expect(effect1).toHaveBeenCalledTimes(1);
    expect(cleanup1).toHaveBeenCalledTimes(0);
    expect(effect2).toHaveBeenCalledTimes(0);
    expect(cleanup2).toHaveBeenCalledTimes(0);

    effect = effect2;
    dep2 = 4;
    rerender();
    expect(effect1).toHaveBeenCalledTimes(1);
    expect(cleanup1).toHaveBeenCalledTimes(1);
    expect(effect2).toHaveBeenCalledTimes(1);
    expect(cleanup2).toHaveBeenCalledTimes(0);

    dep1 = 3;
    effect = effect1;
    rerender();
    expect(effect1).toHaveBeenCalledTimes(2);
    expect(cleanup1).toHaveBeenCalledTimes(1);
    expect(effect2).toHaveBeenCalledTimes(1);
    expect(cleanup2).toHaveBeenCalledTimes(1);

    unmount();
    expect(effect1).toHaveBeenCalledTimes(2);
    expect(cleanup1).toHaveBeenCalledTimes(2);
    expect(effect2).toHaveBeenCalledTimes(1);
    expect(cleanup2).toHaveBeenCalledTimes(1);
  });
});
