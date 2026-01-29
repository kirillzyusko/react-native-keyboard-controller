import { useEffect } from "react";
import { useEvent, useSharedValue } from "react-native-reanimated";

import { useEventHandlerRegistration } from "../../internal";

import type { AnimatedRef } from "react-native-reanimated";
import type Reanimated from "react-native-reanimated";

const NATIVE_SCROLL_EVENT_NAMES = [
  "onScroll",
  "onScrollBeginDrag",
  "onScrollEndDrag",
  "onMomentumScrollBegin",
  "onMomentumScrollEnd",
];

type ScrollEvent = {
  contentOffset: {
    x: number;
    y: number;
  };
  layoutMeasurement: {
    width: number;
    height: number;
  };
  contentSize: {
    width: number;
    height: number;
  };
};

const useScrollState = (ref: AnimatedRef<Reanimated.ScrollView>) => {
  const offset = useSharedValue(0);
  const layout = useSharedValue({ width: 0, height: 0 });
  const size = useSharedValue({ width: 0, height: 0 });
  const register = useEventHandlerRegistration(ref);
  const eventHandler = useEvent((event: ScrollEvent) => {
    "worklet";

    // eslint-disable-next-line react-compiler/react-compiler
    offset.value = event.contentOffset.y;
    layout.value = event.layoutMeasurement;
    size.value = event.contentSize;
  }, NATIVE_SCROLL_EVENT_NAMES);

  useEffect(() => {
    const cleanup = register(eventHandler);

    return () => {
      cleanup();
    };
  }, []);

  return { offset, layout, size };
};

export default useScrollState;
