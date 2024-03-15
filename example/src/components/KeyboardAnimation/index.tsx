import React from "react";
import { Animated, TextInput, View } from "react-native";
import {
  useKeyboardAnimation,
  useKeyboardAnimationReplica,
  useKeyboardHandler,
  useReanimatedKeyboardAnimation,
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
// TODO: попробовать анимировать paddingBottom вместо translateY и потестить на реальном устройстве - вдруг анимация translateY это просто наёб от самого iOS который просто берёт значение и сам пытается доанимировать - отсюда и -2 фрейма
export default function KeyboardAnimation() {
  const { height, progress } = useKeyboardAnimation();
  const { height: HeightREA } = useReanimatedKeyboardAnimation();
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
  const s3 = useAnimatedStyle(
    () => ({
      position: 'absolute',
      width: 50,
      height: 50,
      backgroundColor: "black",
      borderRadius: 25,
      left: 0,
      bottom: -HeightREA.value,
    }),
    [],
  );

  return (
    <View style={styles.container}>
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
      <Reanimated.View style={s3} />
    </View>
  );
}
