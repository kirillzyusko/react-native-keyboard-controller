import React from "react";
import { TextInput, View } from "react-native";
import {
  KeyboardBackgroundView,
  KeyboardStickyView,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ReanimatedBackgroundView = Reanimated.createAnimatedComponent(
  KeyboardBackgroundView,
);
const ReanimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

const KeyboardSharedTransitionExample = () => {
  const { bottom } = useSafeAreaInsets();
  const { progress } = useReanimatedKeyboardAnimation();

  const opacity = useAnimatedStyle(
    () => ({
      height: 291 + 70,
      opacity: progress.value,
    }),
    [],
  );
  const inputColor = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ["#323232", "#474747"],
      ),
    }),
    [],
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#000000",
        flex: 1,
        justifyContent: "flex-end",
      }}
    >
      <KeyboardStickyView offset={{ closed: 291, opened: 291 + bottom }}>
        <ReanimatedBackgroundView style={opacity} />
        <View
          style={{
            marginHorizontal: 30,
            marginVertical: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          }}
        >
          <ReanimatedTextInput
            placeholder="127.0.0.1"
            placeholderTextColor="#ecececec"
            style={[
              {
                width: "100%",
                padding: 10,
                borderRadius: 8,
                textAlign: "center",
              },
              inputColor,
            ]}
          />
        </View>
      </KeyboardStickyView>
    </SafeAreaView>
  );
};

export default KeyboardSharedTransitionExample;
