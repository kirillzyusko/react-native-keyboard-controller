import { useSharedValue } from "react-native-reanimated";

import { useKeyboardContext } from "../src/context";
import { useKeyboardHandler } from "../src/hooks";

import type { NativeEvent } from "../src/types";

// Control for the start-before-first-move probe, with the iOS frame guard disabled.
const IS_IOS = false;

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
