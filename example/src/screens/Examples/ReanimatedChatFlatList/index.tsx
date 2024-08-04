import React from "react";
import { FlatList, TextInput, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
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

const useGradualAnimation = () => {
  const height = useSharedValue(0);

  useKeyboardHandler(
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

  return { height };
};

function ReanimatedChatFlatList() {
  const { height } = useGradualAnimation();

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
        contentContainerStyle={styles.contentContainer}
        data={reversedMessages}
        initialNumToRender={15}
        renderItem={RenderItem}
      />
      <TextInput style={styles.textInput} />
      <Animated.View style={fakeView} />
    </View>
  );
}

export default ReanimatedChatFlatList;
