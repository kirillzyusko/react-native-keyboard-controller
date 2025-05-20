import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

import type { WindowDimensionsEventData } from "../../types";

const screen = Dimensions.get("screen");

let initialDimensions: WindowDimensionsEventData = {
  width: screen.width,
  height: screen.height,
};

Dimensions.addEventListener("change", (e) => {
  initialDimensions = {
    width: e.screen.width,
    height: e.screen.height,
  };
});

/**
 * On iOS we need to use `screen`, because this property is derived from `mainScreen.bounds.size`
 * while `window` is based on `[RCTKeyWindowValuesProxy sharedInstance].windowSize`, which can have
 * out of date values (especially when device gets rotated).
 *
 * @returns Window dimension.
 * @example
 * ```
 * const { height, window } = useWindowDimensions();
 * ```
 */
export const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState(initialDimensions);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", (e) => {
      setDimensions({
        width: e.screen.width,
        height: e.screen.height,
      });
    });

    // we might have missed an update between reading a value in render and
    // `addListener` in this handler, so we set it here. If there was
    // no change, React will filter out this update as a no-op.
    setDimensions(initialDimensions);

    return () => {
      subscription.remove();
    };
  }, []);

  return dimensions;
};
