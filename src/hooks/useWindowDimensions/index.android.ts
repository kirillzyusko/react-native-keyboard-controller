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

    return () => {
      subscription.remove();
    };
  }, []);

  return dimensions;
};
