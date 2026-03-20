import React from "react";
import { TextInput, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Reanimated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

function useGradualKeyboardAnimation() {
  const height = useSharedValue(0);
  const progress = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";

        // eslint-disable-next-line react-compiler/react-compiler
        height.value = e.height;
        progress.value = e.progress;
      },
      onEnd: (e) => {
        "worklet";

        height.value = e.height;
        progress.value = e.progress;
      },
    },
    [],
  );

  return { height, progress };
}

function NonUIProps() {
  const { height, progress } = useGradualKeyboardAnimation();

  const rStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: "gray",
      height: height.value,
      width: interpolate(progress.value, [0, 1], [100, 200]),
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{ width: "100%", height: 50, backgroundColor: "red" }}
      />
      <Reanimated.View style={rStyle} />
    </View>
  );
}

export default NonUIProps;
