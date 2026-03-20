"use no memo";

import { type MutableRefObject, useCallback } from "react";

type RefItem<T> =
  | ((element: T | null) => void)
  | MutableRefObject<T | null>
  | null
  | undefined;

export const useCombinedRef = <T>(...refs: RefItem<T>[]) => {
  const callback = useCallback((element: T | null) => {
    for (const ref of refs) {
      if (!ref) {
        continue;
      }

      if (typeof ref === "function") {
        ref(element);
      } else {
        ref.current = element;
      }
    }
  }, refs);

  return callback;
};
