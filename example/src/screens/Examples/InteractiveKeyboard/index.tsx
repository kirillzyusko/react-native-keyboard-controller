import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import {
  KeyboardGestureArea,
  useKeyboardHandler,
} from "react-native-keyboard-controller";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import Message from "../../../components/Message";
import { history } from "../../../components/Message/data";

import styles from "./styles";

import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";

const AnimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

const useKeyboardAnimation = () => {
  const progress = useSharedValue(0);
  const height = useSharedValue(0);
  useKeyboardHandler({
    onMove: (e) => {
      "worklet";

      progress.value = e.progress;
      height.value = e.height;
    },
    onInteractive: (e) => {
      "worklet";

      progress.value = e.progress;
      height.value = e.height;
    },
  });

  return { height, progress };
};

type Props = StackScreenProps<ExamplesStackParamList>;

function InteractiveKeyboard({ navigation }: Props) {
  const [interpolator, setInterpolator] = useState<"ios" | "linear">("linear");
  const { height } = useKeyboardAnimation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.header}
          onPress={() =>
            setInterpolator(interpolator === "ios" ? "linear" : "ios")
          }
        >
          {interpolator}
        </Text>
      ),
    });
  }, [interpolator]);

  const scrollViewStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: -height.value }, ...styles.inverted.transform],
    }),
    [],
  );
  const textInputStyle = useAnimatedStyle(
    () => ({
      height: 50,
      width: "100%",
      backgroundColor: "#BCBCBC",
      transform: [{ translateY: -height.value }],
    }),
    [],
  );
  const fakeView = useAnimatedStyle(
    () => ({
      height: height.value,
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <KeyboardGestureArea
        style={styles.content}
        interpolator={interpolator}
        showOnSwipeUp
        offset={50}
      >
        <Reanimated.ScrollView
          showsVerticalScrollIndicator={false}
          style={scrollViewStyle}
        >
          <View style={styles.inverted}>
            <Reanimated.View style={fakeView} />
            {history.map((message, index) => (
              <Message key={index} {...message} />
            ))}
          </View>
        </Reanimated.ScrollView>
      </KeyboardGestureArea>
      <AnimatedTextInput style={textInputStyle} />
    </View>
  );
}

export default InteractiveKeyboard;
