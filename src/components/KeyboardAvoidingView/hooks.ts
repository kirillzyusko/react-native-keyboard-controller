import { useSharedValue } from "react-native-reanimated";

import {
  useKeyboardContext,
  useKeyboardHandler,
} from "react-native-keyboard-controller";

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

        // `height` update happens in `onMove` handler
        // in `onEnd` we need to update only if `onMove`
        // wasn't called (i. e. duration === 0)
        //
        // we can not call this code without condition below
        // because in some corner cases (iOS with `secureTextEntry`)
        // `onEnd` can be emitted before `onMove` and in this case
        // it may lead to choppy/glitchy/jumpy UI
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
