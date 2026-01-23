import { Platform } from "react-native";
import {
  useAnimatedRef,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";

import { useKeyboardHandler } from "../../hooks";

import type Reanimated from "react-native-reanimated";

const OS = Platform.OS;

// TODO:
// - we need to manage offset somehow more smartly, for example - you scrolled to up, open keyboard, close keyboard - we don't animate content (though we should?) also check how it works on Android
const useKeyboardAnimation = () => {
  const animatedRef = useAnimatedRef<Reanimated.ScrollView>();
  const translateY = useSharedValue(0);
  const padding = useSharedValue(0);
  const offset = useSharedValue(0);
  const scroll = useScrollViewOffset(animatedRef);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        console.log("onStart", e, offset.value);

        if (OS === "ios") {
          // eslint-disable-next-line react-compiler/react-compiler
          translateY.value = e.height;
        }

        if (e.height === 0) {
          padding.value = 0;
          offset.value = scroll.value;
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

        console.log("onEnd", e, "offset", offset.value, "scroll", scroll.value);

        if (e.height > 0) {
          console.log(scroll.value);
          // offset.value -> 1889
          padding.value = e.height;
          offset.value = e.height;
        }
      },
    },
    [],
  );

  return {
    translateY,
    padding,
    offset,
    animatedRef,
    scroll,
  };
};

export { useKeyboardAnimation };
