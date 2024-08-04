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

      // eslint-disable-next-line react-compiler/react-compiler
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
        showOnSwipeUp
        interpolator={interpolator}
        offset={50}
        style={styles.content}
        testID="chat.gesture"
      >
        <Reanimated.ScrollView
          showsVerticalScrollIndicator={false}
          style={scrollViewStyle}
          testID="chat.scroll"
        >
          <View style={styles.inverted}>
            <Reanimated.View style={fakeView} />
            {history.map((message, index) => (
              <Message key={index} {...message} />
            ))}
          </View>
        </Reanimated.ScrollView>
      </KeyboardGestureArea>
      <AnimatedTextInput style={textInputStyle} testID="chat.input" />
    </View>
  );
}

export default InteractiveKeyboard;
