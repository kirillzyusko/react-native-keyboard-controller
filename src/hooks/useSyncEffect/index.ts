import { useEffect, useRef } from "react";

import type { DependencyList } from "react";

/**
 * @description
 * Equivalent to `useEffect` but will run the effect synchronously, i. e. before render.
 *
 * @param {effect} - imperative function
 * @param {deps} - if present, effect will only activate if the values in the list change
 *
 * @author Kiryl Ziusko
 * @since 1.13.0
 * @version 1.0.0
 */
const useSyncEffect: typeof useEffect = (effect, deps) => {
  const cachedDeps = useRef<DependencyList | undefined | null>(null);
  const areDepsEqual = deps?.every(
    (el, index) => cachedDeps.current && el === cachedDeps.current[index],
  );
  const cleanupRef = useRef<(() => void) | void>();

  if (!areDepsEqual || !cachedDeps.current) {
    cleanupRef.current?.();
    cleanupRef.current = effect();
    cachedDeps.current = deps;
  }

  useEffect(() => {
    // strict mode double effect invocation handling
    if (deps !== cachedDeps.current) {
      cleanupRef.current = effect();
      cachedDeps.current = deps;
    }
  }, deps);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cachedDeps.current = null;
    };
  }, []);
};

export default useSyncEffect;
