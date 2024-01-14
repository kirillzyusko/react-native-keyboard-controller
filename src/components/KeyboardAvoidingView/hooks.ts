import { useSharedValue } from "react-native-reanimated";

import { useKeyboardHandler } from "react-native-keyboard-controller";

export const useKeyboardAnimation = () => {
  const heightWhenOpened = useSharedValue(0);
  const height = useSharedValue(0);
  const progress = useSharedValue(0);
  const isClosed = useSharedValue(true);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        if (e.height > 0) {
          isClosed.value = false;
          heightWhenOpened.value = e.height;
        }
      },
      onMove: (e) => {
        "worklet";

        progress.value = e.progress;
        height.value = e.height;
      },
      onEnd: (e) => {
        "worklet";

        isClosed.value = e.height === 0;

        // update value only if transition was instant
        // otherwise update will happen in `onMove` handler
        // this `if` condition is needed to handle `secureTextEntry`
        // see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/327
        if (e.duration === 0) {
          progress.value = e.progress;
          height.value = e.height;
        }
      },
    },
    [],
  );

  return { height, progress, heightWhenOpened, isClosed };
};
