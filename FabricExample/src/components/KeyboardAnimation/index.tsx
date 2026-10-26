import React from "react";
import { Animated, TextInput, TouchableOpacity, View } from "react-native";
import {
  KeyboardController,
  useGenericKeyboardHandler,
  useKeyboardAnimation,
} from "react-native-keyboard-controller";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import styles from "./styles";

const useGradualKeyboardAnimation = () => {
  const height = useSharedValue(0);

  useGenericKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";

        // eslint-disable-next-line react-compiler/react-compiler
        height.value = e.height;
      },
      onEnd: (e) => {
        "worklet";

        height.value = e.height;
      },
    },
    [],
  );

  return height;
};

type Props = {
  provider?: typeof useKeyboardAnimation;
};

export default function KeyboardAnimation({
  // eslint-disable-next-line react-compiler/react-compiler
  provider = useKeyboardAnimation,
}: Props) {
  // eslint-disable-next-line react-compiler/react-compiler
  const { height, progress } = provider();
  const keyboard = useGradualKeyboardAnimation();

  const gradual = useAnimatedStyle(
    () => ({
      width: 50,
      height: 50,
      backgroundColor: "gray",
      borderRadius: 25,
      transform: [{ translateY: -keyboard.value }],
    }),
    [],
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={KeyboardController.dismiss}
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
            style={{
              width: 200,
              marginTop: 50,
              height: 50,
              backgroundColor: "yellow",
            }}
            testID="keyboard_animation_text_input"
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
            <Reanimated.View style={gradual} />
          </View>
        </View>
      </>
    </TouchableOpacity>
  );
}
