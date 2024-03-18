import React from "react";
import { Animated, TextInput, TouchableOpacity, View } from "react-native";
import {
  KeyboardController,
  useKeyboardAnimation,
  useKeyboardHandler,
} from "react-native-keyboard-controller";
import Reanimated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import styles from "./styles";

const useA = () => {
  const height = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";

        height.value = e.height;
      },
    },
    [],
  );

  return height;
};

export default function KeyboardAnimation() {
  const { height, progress } = useKeyboardAnimation();
  const a = useA();
  const b = useAnimatedKeyboard();

  const s = useAnimatedStyle(
    () => ({
      width: 50,
      height: 50,
      backgroundColor: "gray",
      borderRadius: 25,
      bottom: a.value,
    }),
    [],
  );
  const s2 = useAnimatedStyle(
    () => ({
      width: 50,
      height: 50,
      backgroundColor: "pink",
      borderRadius: 25,
      bottom: b.height.value,
    }),
    [],
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => KeyboardController.dismiss()}
    >
      <>
        <View>
          <Animated.View
            style={{
              width: 50,
              height: 50,
              backgroundColor: "green",
              borderRadius: 25,
              transform: [
                {
                  translateX: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 100],
                  }),
                },
              ],
            }}
          />
        </View>
        <View>
          <TextInput
            testID="keyboard_animation_text_input"
            style={{
              width: 200,
              marginTop: 50,
              height: 50,
              backgroundColor: "yellow",
            }}
          />
          <View style={[styles.row, styles.center]}>
            <Animated.View
              style={{
                width: 50,
                height: 50,
                backgroundColor: "red",
                borderRadius: 25,
                transform: [{ translateY: height }],
              }}
            />
            <Reanimated.View style={s} />
            <Reanimated.View style={s2} />
          </View>
        </View>
      </>
    </TouchableOpacity>
  );
}
