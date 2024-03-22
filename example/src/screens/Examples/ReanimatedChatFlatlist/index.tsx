import React from "react";
import {
  FlatList,
  LayoutAnimation,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  KeyboardController,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import Message from "../../../components/Message";
import { history } from "../../../components/Message/data";

import styles from "./styles";

import type { MessageProps } from "../../../components/Message/types";
import type { ListRenderItem } from "react-native";

const reversedMessages = [...history].reverse();

const RenderItem: ListRenderItem<MessageProps> = ({ item, index }) => {
  return <Message key={index} {...item} />;
};

function ReanimatedChatFlatlist() {
  const { height } = useReanimatedKeyboardAnimation();

  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.abs(height.value),
    }),
    [],
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        /*LayoutAnimation.configureNext({
          duration: 250,
          update: {
            duration: 250,
            type: "keyboard",
          },
        });*/
        // KeyboardController.dismiss();
      }}
    >
      <View style={styles.container}>
        <FlatList
          keyboardShouldPersistTaps="never"
          inverted
          initialNumToRender={15}
          contentContainerStyle={styles.contentContainer}
          data={reversedMessages}
          renderItem={RenderItem}
        />
        <TextInput style={styles.textInput} />
        <Animated.View style={fakeView} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default ReanimatedChatFlatlist;
