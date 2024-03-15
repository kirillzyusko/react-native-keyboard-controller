import React from "react";
import { FlatList, TextInput, View } from "react-native";
import {
  useKeyboardHandler,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import Message from "../../../components/Message";
import { history } from "../../../components/Message/data";

import styles from "./styles";

import type { MessageProps } from "../../../components/Message/types";
import type { ListRenderItem } from "react-native";

const reversedMessages = [...history].reverse();

const RenderItem: ListRenderItem<MessageProps> = ({ item, index }) => {
  return <Message key={index} {...item} />;
};

function useGradualKeyboardAnimation() {
  const height = useSharedValue(0);
  const progress = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";

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

function ReanimatedChatFlatlist() {
  const { height } = useGradualKeyboardAnimation();

  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.abs(height.value),
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        initialNumToRender={15}
        contentContainerStyle={styles.contentContainer}
        data={reversedMessages}
        renderItem={RenderItem}
      />
      <TextInput style={styles.textInput} />
      <Animated.View style={fakeView} />
    </View>
  );
}

export default ReanimatedChatFlatlist;
