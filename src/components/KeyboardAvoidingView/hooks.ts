import { useSharedValue } from "react-native-reanimated";

import { useKeyboardContext } from "../../context";
import { useKeyboardHandler } from "../../hooks";

export const useKeyboardAnimation = () => {
  const { reanimated } = useKeyboardContext();
  const heightWhenOpened = useSharedValue(-reanimated.height.value);
  const height = useSharedValue(-reanimated.height.value);
  const progress = useSharedValue(reanimated.progress.value);
  const isClosed = useSharedValue(reanimated.progress.value === 0);

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
