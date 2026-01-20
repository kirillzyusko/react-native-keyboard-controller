import { Platform } from "react-native";
import {
  useAnimatedRef,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";

import { useKeyboardHandler } from "../../hooks";

import type Reanimated from "react-native-reanimated";

const OS = Platform.OS;

const useKeyboardAnimation = () => {
  const animatedRef = useAnimatedRef<Reanimated.ScrollView>();
  const translateY = useSharedValue(0);
  const padding = useSharedValue(0);
  const offset = useScrollViewOffset(animatedRef);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        console.log("onStart", e, offset.value);

        // eslint-disable-next-line react-compiler/react-compiler
        translateY.value = e.height;

        if (e.height === 0) {
          padding.value = e.height;
        }
      },
      onInteractive: (e) => {
        "worklet";

        console.log("onInteractive", e);
      },
      onMove: (e) => {
        "worklet";

        console.log("onMove", e);

        if (OS !== "ios") {
          translateY.value = e.height;
        }
      },
      onEnd: (e) => {
        "worklet";

        console.log("onEnd", e);

        if (e.height > 0) {
          padding.value = e.height;
        }
      },
    },
    [],
  );

  return {
    translateY,
    padding,
    animatedRef,
  };
};

export { useKeyboardAnimation };
