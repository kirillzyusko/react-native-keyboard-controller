import {
  useRef,
  useEffect,
  useMemo,
  DependencyList,
  EffectCallback,
} from "react";
import { Animated, findNodeHandle } from "react-native";
import {
  registerEventHandler,
  unregisterEventHandler,
  // TODO: in reanimated 3.15 the path was changed
} from "react-native-reanimated/src/reanimated2/core";

export const useSyncEffect = (
  effect: EffectCallback,
  deps?: DependencyList,
): void => {
  const key = useRef({});
  const cleanupRef = useRef<ReturnType<typeof effect>>();

  const currentKey = useMemo(
    () => ({ a: Math.random() }),
    deps as DependencyList,
  );

  if (key.current !== currentKey) {
    key.current = currentKey;
    cleanupRef.current = effect();
  }

  useEffect(
    () => () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    },
    [currentKey],
  );
};

type EventHandler = (event: never) => void;

export function useEventHandlerRegistration<
  H extends Partial<Record<string, EventHandler>>,
>(map: Map<keyof H, string>, viewTagRef: React.MutableRefObject<any>) {
  const onRegisterHandler = (handler: H) => {
    console.log(handler);
    const viewTag = findNodeHandle(viewTagRef.current);
    const ids = Object.keys(handler).map((handlerName) => {
      const eventName = map.get(handlerName as keyof H);
      const functionToCall = handler[handlerName as keyof H];
      console.log(functionToCall?.toString(), eventName, viewTag);
      if (eventName && viewTag) {
        return registerEventHandler(
          (event: Parameters<NonNullable<H[keyof H]>>[0]) => {
            "worklet";

            functionToCall?.(event);
          },
          eventName,
          viewTag,
        );
      }

      return null;
    });

    return () => {
      console.log("cleanup", ids);
      ids.forEach((id) => (id ? unregisterEventHandler(id) : null));
    };
  };

  return onRegisterHandler;
}

/**
 * TS variant of `useAnimatedValue` hook which is added in RN 0.71
 * A better alternative of storing animated values in refs, since
 * it doesn't recreate a new `Animated.Value` object on every re-render
 * and therefore consumes less memory. We can not use a variant from
 * RN, since this library supports earlier versions of RN.
 *
 * @see https://github.com/facebook/react-native/commit/e22217fe8b9455e32695f88ca835e11442b0a937
 */
export function useAnimatedValue(
  initialValue: number,
  config?: Animated.AnimatedConfig,
): Animated.Value {
  const ref = useRef<Animated.Value | null>(null);

  if (ref.current === null) {
    ref.current = new Animated.Value(initialValue, config);
  }

  return ref.current;
}
