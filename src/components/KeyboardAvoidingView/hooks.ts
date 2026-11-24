import { Platform } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { useKeyboardContext } from "../../context";
import { useKeyboardHandler } from "../../hooks";

import type { NativeEvent } from "../../types";

const IS_IOS = Platform.OS === "ios";

export const useKeyboardAnimation = () => {
  const { reanimated } = useKeyboardContext();

  const heightWhenOpened = useSharedValue(0);
  const height = useSharedValue(0);
  const progress = useSharedValue(0);
  const isClosed = useSharedValue(true);
  const openingStarts = useSharedValue(0);
  const frameRevision = useSharedValue(0);

  const onFrame = (e: NativeEvent) => {
    "worklet";
    frameRevision.value += 1;
    progress.value = e.progress;
    height.value = e.height;

    if (e.height > 0) {
      isClosed.value = false;

      if (heightWhenOpened.value === 0 && e.progress > 0) {
        heightWhenOpened.value = e.height / e.progress;
      }
    }
  };

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        // On iOS the provider jumps to the destination at start. Keep our
        // current frame until the native move arrives.
        if (IS_IOS) {
          // eslint-disable-next-line react-compiler/react-compiler
          frameRevision.value += 1;
        }

        if (e.height > 0) {
          openingStarts.value += 1;
          isClosed.value = false;
          heightWhenOpened.value = e.height;
        }
      },
      onMove: onFrame,
      onInteractive: onFrame,
      onEnd: (e) => {
        "worklet";

        frameRevision.value += 1;
        isClosed.value = e.height === 0;

        if (e.progress === 1) {
          heightWhenOpened.value = e.height;
        }

        height.value = e.height;
        progress.value = e.progress;
      },
    },
    [],
    () => {
      // Compare against this attachment, including when Suspense reuses the view.
      const openingStartsBefore = openingStarts.value;
      const frameRevisionBefore = frameRevision.value;

      return () => {
        "worklet";
        const initialHeight = -reanimated.height.value;
        const initialProgress = reanimated.progress.value;

        if (frameRevision.value === frameRevisionBefore) {
          height.value = initialHeight;
          progress.value = initialProgress;
        }
        if (openingStarts.value === openingStartsBefore) {
          // Native move events report progress as height / opened height.
          heightWhenOpened.value =
            progress.value > 0 ? height.value / progress.value : 0;
        }
        if (
          openingStarts.value === openingStartsBefore &&
          frameRevision.value === frameRevisionBefore
        ) {
          isClosed.value = initialProgress === 0;
        }
      };
    },
  );

  return { height, progress, heightWhenOpened, isClosed };
};
export const useTranslateAnimation = () => {
  const { reanimated } = useKeyboardContext();
  const padding = useSharedValue(0);
  const paddingUpdates = useSharedValue(0);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        // eslint-disable-next-line react-compiler/react-compiler
        paddingUpdates.value += 1;

        if (e.height === 0) {
          padding.value = 0;
        }
      },
      onInteractive: () => {
        "worklet";

        paddingUpdates.value += 1;
        padding.value = 0;
      },
      onEnd: (e) => {
        "worklet";

        paddingUpdates.value += 1;
        padding.value = e.progress;
      },
    },
    [],
    () => {
      const before = paddingUpdates.value;

      return () => {
        "worklet";

        if (paddingUpdates.value === before) {
          padding.value = reanimated.progress.value;
        }
      };
    },
  );

  return { translate: reanimated.progress, padding };
};
