import React from "react";
import { Animated, TextInput, View } from "react-native";
import {
  useKeyboardAnimation,
  useKeyboardAnimationReplica,
  useKeyboardHandler,
} from "react-native-keyboard-controller";

import styles from "./styles";
import Reanimated, { useAnimatedKeyboard, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

const useA = () => {
  const height = useSharedValue(0);

  useKeyboardHandler({
    onMove: (e) => {
      "worklet";

      height.value = e.height;
    },
  }, []);

  return height;
};

export default function KeyboardAnimation() {
  const { height, progress } = useKeyboardAnimation();
  const a = useA();
  const b = useAnimatedKeyboard();

  const s = useAnimatedStyle(() => ({
    width: 50,
    height: 50,
    backgroundColor: "gray",
    borderRadius: 25,
    transform: [
      {
        translateY: -a.value,
      },
    ],
  }), []);
  const s2 = useAnimatedStyle(() => ({
    width: 50,
    height: 50,
    backgroundColor: "pink",
    borderRadius: 25,
    transform: [
      {
        translateY: -b.height.value,
      },
    ],
  }), []);

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
    </View>
  );
}
