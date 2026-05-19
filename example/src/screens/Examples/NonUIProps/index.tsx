import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
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
      backgroundColor: "#007AFF",
      borderRadius: 8,
      height: height.value,
      width: interpolate(progress.value, [0, 1], [100, 200]),
    };
  });

  return (
    <View style={nonUIStyles.container}>
      <TextInput
        style={nonUIStyles.input}
        placeholder="Type something..."
        placeholderTextColor="#8E8E93"
      />
      <Reanimated.View style={rStyle} />
    </View>
  );
}

const nonUIStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    paddingHorizontal: 16,
    color: "#1C1C1E",
    fontSize: 16,
  },
});

export default NonUIProps;
