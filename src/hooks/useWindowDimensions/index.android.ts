import { useEffect, useState } from "react";

import { WindowDimensionsEvents } from "../../bindings";

import type { WindowDimensionsEventData } from "../../types";

let initialDimensions: WindowDimensionsEventData = {
  width: 0,
  height: 0,
};

WindowDimensionsEvents.addListener("windowDidResize", (e) => {
  initialDimensions = e;
});

export const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState(initialDimensions);

  useEffect(() => {
    const subscription = WindowDimensionsEvents.addListener(
      "windowDidResize",
      (e) => {
        setDimensions(e);
      },
    );

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
