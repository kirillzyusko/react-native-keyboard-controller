import { useState } from "react";
import { Platform } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { useKeyboardContext } from "../../context";
import { useKeyboardHandler } from "../../hooks";

const OS = Platform.OS;

export const useKeyboardAnimation = () => {
  const { reanimated } = useKeyboardContext();

  // calculate it only once on mount, to avoid `SharedValue` reads during a render
  const [initialHeight] = useState(() => -reanimated.height.value);
  const [initialProgress] = useState(() => reanimated.progress.value);

  const heightWhenOpened = useSharedValue(initialHeight);
  const height = useSharedValue(initialHeight);
  const progress = useSharedValue(initialProgress);
  const isClosed = useSharedValue(initialProgress === 0);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        if (e.height > 0) {
          // eslint-disable-next-line react-compiler/react-compiler
          isClosed.value = false;
          heightWhenOpened.value = e.height;
        }
      },
      onMove: (e) => {
        "worklet";

        progress.value = e.progress;
        height.value = e.height;
      },
      onInteractive: (e) => {
        "worklet";

        progress.value = e.progress;
        height.value = e.height;
      },
      onEnd: (e) => {
        "worklet";

        isClosed.value = e.height === 0;

        height.value = e.height;
        progress.value = e.progress;
      },
    },
    [],
  );

  return { height, progress, heightWhenOpened, isClosed };
};
export const useTranslateAnimation = () => {
  const { reanimated } = useKeyboardContext();

  // calculate it only once on mount, to avoid `SharedValue` reads during a render
  const [initialProgress] = useState(() => reanimated.progress.value);

  const padding = useSharedValue(initialProgress);
  const translate = useSharedValue(0);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        if (e.height === 0) {
          // eslint-disable-next-line react-compiler/react-compiler
          padding.value = 0;
        }
        if (OS === "ios") {
          translate.value = e.progress;
        }
      },
      onMove: (e) => {
        "worklet";

        if (OS === "android") {
          translate.value = e.progress;
        }
      },
      onEnd: (e) => {
        "worklet";

        padding.value = e.progress;

        if (OS === "android") {
          translate.value = e.progress;
        }
      },
    },
    [],
  );

  return { translate, padding };
};
