import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { FlatList, TextInput } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import Message from "../../../components/Message";
import { history } from "../../../components/Message/data";

import styles from "./styles";

import type { MessageProps } from "../../../components/Message/types";
import type { ListRenderItem } from "react-native";

const reversedMessages = [...history].reverse();

const RenderItem: ListRenderItem<MessageProps> = ({ item, index }) => {
  return <Message key={index} {...item} />;
};

function ReanimatedChatFlatList() {
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      behavior="translate-with-padding"
      keyboardVerticalOffset={headerHeight}
      style={styles.container}
      testID="flat-list.container"
    >
      <FlatList
        inverted
        contentContainerStyle={styles.contentContainer}
        data={reversedMessages}
        initialNumToRender={15}
        renderItem={RenderItem}
        testID="flat-list.chat"
      />
      <TextInput style={styles.textInput} testID="flat-list.input" />
    </KeyboardAvoidingView>
  );
}

export default ReanimatedChatFlatList;
